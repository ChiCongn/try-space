import { apiClient } from "./api";
import { normalizeProduct, type ApiProduct } from "./product.api";
import type { ApiResponse, WishlistItem } from "../types";

type ApiWishlistItem =
  | (Partial<Omit<WishlistItem, "product">> & {
      createdAt?: string;
      productId?: string;
      product?: ApiProduct;
    })
  | ApiProduct;

interface ApiWishlistList {
  items: ApiWishlistItem[];
  totalItems?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function responseData<T>(payload: T | { data: T }) {
  return isRecord(payload) && "data" in payload ? (payload.data as T) : payload;
}

function responseItems(payload: ApiWishlistItem[] | ApiWishlistList) {
  return Array.isArray(payload) ? payload : payload.items;
}

function normalizeWishlistItem(item: ApiWishlistItem): WishlistItem {
  const record = item as Partial<WishlistItem> & {
    createdAt?: string;
    productId?: string;
    product?: ApiProduct;
  };
  const product =
    record.product ??
    ({
      ...(item as ApiProduct),
      id: (item as ApiProduct).id ?? record.productId ?? record.id,
    } as ApiProduct);

  return {
    addedAt: record.addedAt ?? record.createdAt ?? new Date().toISOString(),
    id: record.id ?? product.id ?? record.productId ?? crypto.randomUUID(),
    product: normalizeProduct(product),
  };
}

export const wishlistApi = {
  async getMine(): Promise<ApiResponse<WishlistItem[]>> {
    const response = await apiClient.get<
      ApiResponse<ApiWishlistItem[] | ApiWishlistList> | ApiWishlistItem[] | ApiWishlistList
    >("/wishlist");
    const data = responseData(response.data);
    return { data: responseItems(data).map((item) => normalizeWishlistItem(item)) };
  },

  async add(productId: string): Promise<ApiResponse<{ productId: string }>> {
    await apiClient.post<ApiResponse<ApiWishlistItem>>("/wishlist", { productId });
    return { data: { productId } };
  },

  async remove(productId: string): Promise<ApiResponse<{ productId: string }>> {
    await apiClient.delete<ApiResponse<{ productId: string }>>(
      `/wishlist/${productId}`,
    );
    return { data: { productId } };
  },
};
