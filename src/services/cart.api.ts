import { apiClient, mockDelay, useMockApi } from "./api";
import type { ApiResponse, CartItem } from "../types";

export const cartApi = {
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    if (useMockApi) {
      await mockDelay(200);
      return { data: [] };
    }

    const response = await apiClient.get<ApiResponse<CartItem[]>>("/cart");
    return response.data;
  },

  async syncCart(items: CartItem[]): Promise<ApiResponse<CartItem[]>> {
    if (useMockApi) {
      await mockDelay(300);
      return { data: items };
    }

    const response = await apiClient.put<ApiResponse<CartItem[]>>("/cart", {
      items,
    });
    return response.data;
  },
};
