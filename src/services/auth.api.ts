import { apiClient, mockDelay, useMockApi } from "./api";
import type {
  ApiResponse,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types";

const mockUsers: Array<User & { password: string }> = [
  {
    avatar: "",
    email: "minh@tryspace.app",
    id: "u1",
    name: "Minh Trần",
    password: "password123",
  },
];

export const authApi = {
  async login(
    payload: LoginPayload,
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    if (useMockApi) {
      await mockDelay();
      const found = mockUsers.find(
        (user) =>
          user.email === payload.email && user.password === payload.password,
      );

      if (!found) {
        throw { response: { data: { message: "Email hoặc mật khẩu không đúng" } } };
      }

      const { password: _password, ...user } = found;
      void _password;

      return {
        data: {
          tokens: {
            accessToken: `mock_access_${Date.now()}`,
            refreshToken: `mock_refresh_${Date.now()}`,
          },
          user,
        },
      };
    }

    const response = await apiClient.post<
      ApiResponse<{ user: User; tokens: AuthTokens }>
    >("/auth/login", payload);
    return response.data;
  },

  async register(
    payload: RegisterPayload,
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    if (useMockApi) {
      await mockDelay();

      if (mockUsers.find((user) => user.email === payload.email)) {
        throw { response: { data: { message: "Email đã được sử dụng" } } };
      }

      const newUser: User & { password: string } = {
        email: payload.email,
        id: `u${Date.now()}`,
        name: payload.name,
        password: payload.password,
      };
      mockUsers.push(newUser);

      const { password: _password, ...user } = newUser;
      void _password;

      return {
        data: {
          tokens: {
            accessToken: `mock_access_${Date.now()}`,
            refreshToken: `mock_refresh_${Date.now()}`,
          },
          user,
        },
      };
    }

    const response = await apiClient.post<
      ApiResponse<{ user: User; tokens: AuthTokens }>
    >("/auth/register", payload);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    if (useMockApi) {
      await mockDelay(200);
      return {
        data: {
          email: "minh@tryspace.app",
          id: "u1",
          name: "Minh Trần",
        },
      };
    }

    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  async logout(): Promise<void> {
    if (useMockApi) {
      return;
    }

    await apiClient.post("/auth/logout");
  },
};
