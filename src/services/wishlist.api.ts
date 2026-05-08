import { apiClient, mockDelay, useMockApi } from "./api";
import { useWishlistStore } from "../store/wishlistStore";
import type { ApiResponse, WishlistItem } from "../types";

export const wishlistApi = {
  async getMine(): Promise<ApiResponse<WishlistItem[]>> {
    if (useMockApi) {
      await mockDelay(120);
      return { data: useWishlistStore.getState().items };
    }

    const response = await apiClient.get<ApiResponse<WishlistItem[]>>("/wishlist");
    return response.data;
  },
};
