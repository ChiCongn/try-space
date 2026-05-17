import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/authStore";
import { logger } from "../utils/logger";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:4000/api/v1";

let isRefreshing = false;
let failedQueue: Array<{
  reject: (reason?: unknown) => void;
  resolve: (token: string) => void;
}> = [];

interface RequestMetadata {
  requestId: string;
  startedAt: number;
}

type ApiRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  metadata?: RequestMetadata;
};

function resolveFailedQueue(error: unknown, token?: string) {
  failedQueue.forEach((request) => {
    if (error || !token) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  failedQueue = [];
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const requestId = logger.requestId();

  (config as ApiRequestConfig).metadata = {
    requestId,
    startedAt: performance.now(),
  };
  config.headers["X-Request-Id"] = requestId;
  config.headers["X-Client-Session-Id"] = logger.sessionId;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function apiLogContext(
  config: ApiRequestConfig | undefined,
  response?: AxiosResponse,
) {
  const metadata = config?.metadata;

  return {
    baseURL: config?.baseURL,
    durationMs: metadata
      ? Math.round(performance.now() - metadata.startedAt)
      : undefined,
    method: config?.method?.toUpperCase(),
    requestId: metadata?.requestId,
    status: response?.status,
    url: config?.url,
  };
}

apiClient.interceptors.response.use(
  (response) => {
    const context = apiLogContext(response.config as ApiRequestConfig, response);

    if (context.durationMs && context.durationMs > 3000) {
      logger.warn("api.slow_response", context);
    }

    return response;
  },
  async (error) => {
    const axiosError = error as AxiosError;
    const original = axiosError.config as ApiRequestConfig | undefined;

    if (axiosError.response?.status === 401 && original && !original._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ reject, resolve });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        useAuthStore
          .getState()
          .setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
        resolveFailedQueue(null, data.data.tokens.accessToken);
        original.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;
        return apiClient(original);
      } catch (caught) {
        logger.error("auth.refresh_failed", apiLogContext(original), caught);
        resolveFailedQueue(caught);
        useAuthStore.getState().logout();
      } finally {
        isRefreshing = false;
      }
    }

    logger.error(
      "api.request_failed",
      {
        ...apiLogContext(original, axiosError.response),
        code: axiosError.code,
        serverCode: (
          axiosError.response?.data as
            | { error?: { code?: string }; code?: string }
            | undefined
        )?.error?.code ?? (
          axiosError.response?.data as { code?: string } | undefined
        )?.code,
        serverMessage: (
          axiosError.response?.data as
            | { error?: { message?: string }; message?: string }
            | undefined
        )?.error?.message ?? (
          axiosError.response?.data as { message?: string } | undefined
        )?.message,
      },
      axiosError,
    );

    return Promise.reject(error);
  },
);
