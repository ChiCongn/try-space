import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:4000/api/v1";

export const useMockApi = import.meta.env.VITE_USE_MOCK !== "false";
let isRefreshing = false;
let failedQueue: Array<{
  reject: (reason?: unknown) => void;
  resolve: (token: string) => void;
}> = [];

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

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
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
          .setTokens(data.data.accessToken, data.data.refreshToken);
        resolveFailedQueue(null, data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(original);
      } catch (caught) {
        resolveFailedQueue(caught);
        useAuthStore.getState().logout();
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const mockDelay = (ms = 400) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
