import { apiClient } from "./api";
import type { ApiResponse, CartItem } from "../types";

function selectedVariantId(item: CartItem) {
  if (item.selectedColor.id && item.selectedColor.id !== "default") {
    return item.selectedColor.id;
  }

  if (item.selectedMaterial.id && item.selectedMaterial.id !== "default") {
    return item.selectedMaterial.id;
  }

  return null;
}

function toBackendCartItems(items: CartItem[]) {
  return items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    variantId: selectedVariantId(item),
  }));
}

export const cartApi = {
  async syncCart(items: CartItem[]): Promise<ApiResponse<CartItem[]>> {
    const response = await apiClient.put<ApiResponse<CartItem[]>>("/cart", {
      items: toBackendCartItems(items),
    });
    return response.data;
  },
};
