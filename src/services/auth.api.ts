import { apiClient } from "./api";
import type {
  ApiResponse,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types";

type ApiUser = Omit<Partial<User>, "email" | "id"> &
  Pick<User, "email" | "id"> & {
    avatarUrl?: string;
    displayName?: string;
  };

function normalizeUser(user: ApiUser): User {
  return {
    ...user,
    avatar: user.avatar ?? user.avatarUrl,
    displayName: user.displayName ?? user.name,
    name: user.name ?? user.displayName ?? user.email,
  };
}

export const authApi = {
  async login(
    payload: LoginPayload,
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiClient.post<
      { success: boolean; data: { user: ApiUser; tokens: AuthTokens } }
    >("/auth/login", payload);
    return {
      data: {
        ...response.data.data,
        user: normalizeUser(response.data.data.user),
      },
    };
  },

  async register(
    payload: RegisterPayload,
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const body = {
      displayName: payload.name,
      email: payload.email,
      password: payload.password,
    };
    const response = await apiClient.post<
      { success: boolean; data: { user: ApiUser; tokens: AuthTokens } }
    >("/auth/register", body);
    return {
      data: {
        ...response.data.data,
        user: normalizeUser(response.data.data.user),
      },
    };
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<{ success: boolean; data: ApiUser }>(
      "/auth/me",
    );
    return { data: normalizeUser(response.data.data) };
  },
};
