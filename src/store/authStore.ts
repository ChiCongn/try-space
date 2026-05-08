import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  isLoggedIn: () => boolean;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      initialize: async () => {
        const { accessToken, user } = get();
        if (!accessToken || user) return;

        set({ isLoading: true });
        try {
          const { authApi } = await import("../services/auth.api");
          const response = await authApi.getMe();
          set({ user: response.data });
        } catch {
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },
      isLoading: false,
      isLoggedIn: () => Boolean(get().accessToken),
      logout: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
      refreshToken: null,
      setLoading: (isLoading) => set({ isLoading }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      user: null,
    }),
    {
      name: "tryspace-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
