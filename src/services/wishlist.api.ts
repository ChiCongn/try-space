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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function responseData<T>(payload: T | { data: T }) {
  return isRecord(payload) && "data" in payload ? (payload.data as T) : payload;
}

function isEndpointMissStatus(status: number) {
  return status === 404 || status === 405;
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

function endpointNotFoundError(method: string, urls: string[]) {
  return {
    response: {
      data: {
        message: `Backend chưa có endpoint ${method} wishlist. Đã thử: ${urls.join(", ")}`,
      },
      status: 404,
    },
  };
}

async function firstAvailable<T>(
  candidates: Array<{
    data?: unknown;
    method: "delete" | "get" | "post";
    url: string;
  }>,
) {
  for (const candidate of candidates) {
    const response = await apiClient.request<T>({
      data: candidate.data,
      method: candidate.method,
      url: candidate.url,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || isEndpointMissStatus(status),
    });

    if (!isEndpointMissStatus(response.status)) {
      return response;
    }
  }

  throw endpointNotFoundError(
    candidates[0]?.method.toUpperCase() ?? "REQUEST",
    candidates.map((candidate) => candidate.url),
  );
}

function wishlistListCandidates() {
  return [
    { method: "get" as const, url: "/wishlist" },
    { method: "get" as const, url: "/wishlists" },
    { method: "get" as const, url: "/favorites" },
    { method: "get" as const, url: "/users/me/wishlist" },
    { method: "get" as const, url: "/users/me/favorites" },
  ];
}

function addWishlistCandidates(productId: string) {
  const body = { productId };

  return [
    { data: body, method: "post" as const, url: "/wishlist" },
    { data: body, method: "post" as const, url: "/wishlists" },
    { data: body, method: "post" as const, url: "/favorites" },
    { method: "post" as const, url: `/wishlist/${productId}` },
    { method: "post" as const, url: `/wishlists/${productId}` },
    { method: "post" as const, url: `/favorites/${productId}` },
    { method: "post" as const, url: `/products/${productId}/wishlist` },
    { method: "post" as const, url: `/products/${productId}/favorite` },
    { data: body, method: "post" as const, url: "/wishlist/toggle" },
    { data: body, method: "post" as const, url: "/favorites/toggle" },
  ];
}

function removeWishlistCandidates(productId: string) {
  const body = { productId };

  return [
    { method: "delete" as const, url: `/wishlist/${productId}` },
    { method: "delete" as const, url: `/wishlists/${productId}` },
    { method: "delete" as const, url: `/favorites/${productId}` },
    { method: "delete" as const, url: `/products/${productId}/wishlist` },
    { method: "delete" as const, url: `/products/${productId}/favorite` },
    { data: body, method: "delete" as const, url: "/wishlist" },
    { data: body, method: "delete" as const, url: "/wishlists" },
    { data: body, method: "delete" as const, url: "/favorites" },
    { data: body, method: "post" as const, url: "/wishlist/toggle" },
    { data: body, method: "post" as const, url: "/favorites/toggle" },
  ];
}

export const wishlistApi = {
  async getMine(): Promise<ApiResponse<WishlistItem[]>> {
    const response = await firstAvailable<
      ApiResponse<ApiWishlistItem[]> | ApiWishlistItem[]
    >(wishlistListCandidates());
    const data = responseData(response.data);
    return { data: data.map((item) => normalizeWishlistItem(item)) };
  },

  async add(productId: string): Promise<ApiResponse<{ productId: string }>> {
    await firstAvailable<ApiResponse<ApiWishlistItem>>(
      addWishlistCandidates(productId),
    );
    return { data: { productId } };
  },

  async remove(productId: string): Promise<ApiResponse<{ productId: string }>> {
    await firstAvailable<ApiResponse<{ productId: string }>>(
      removeWishlistCandidates(productId),
    );
    return { data: { productId } };
  },
};
