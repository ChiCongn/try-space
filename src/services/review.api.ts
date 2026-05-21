import { apiClient } from "./api";
import type { ApiResponse, CreateReviewPayload, Review } from "../types";

type ApiReview = Partial<Review> & {
  author?: { displayName?: string; email?: string; name?: string };
  comment?: string;
  helpful?: number;
  product?: { id?: string };
  user?: { displayName?: string; email?: string; name?: string };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapData(payload: unknown): unknown {
  if (!isRecord(payload) || !("data" in payload)) return payload;
  return payload.data;
}

function extractReviews(payload: unknown): ApiReview[] {
  const data = unwrapData(payload);

  if (Array.isArray(data)) return data as ApiReview[];
  if (!isRecord(data)) return [];

  if (Array.isArray(data.reviews)) return data.reviews as ApiReview[];
  if (Array.isArray(data.items)) return data.items as ApiReview[];
  if (Array.isArray(data.data)) return data.data as ApiReview[];

  return [];
}

function normalizeReview(review: ApiReview, productId?: string): Review {
  const user = review.user ?? review.author;

  return {
    content: review.content ?? review.comment ?? "",
    createdAt: review.createdAt ?? new Date().toISOString(),
    helpfulCount: review.helpfulCount ?? review.helpful ?? 0,
    id:
      review.id ??
      `${productId ?? review.productId ?? "review"}-${review.createdAt ?? ""}`,
    productId: review.productId ?? review.product?.id ?? productId ?? "",
    rating: Number(review.rating ?? 0),
    title: review.title ?? "Đánh giá sản phẩm",
    userId: review.userId ?? "",
    userName:
      review.userName ??
      user?.name ??
      user?.displayName ??
      user?.email ??
      "Người dùng",
  };
}

export const reviewApi = {
  async create(payload: CreateReviewPayload): Promise<ApiResponse<Review>> {
    const { productId, ...body } = payload;
    const response = await apiClient.post<unknown>(
      `/products/${productId}/reviews`,
      body,
    );
    return {
      data: normalizeReview(unwrapData(response.data) as ApiReview, productId),
    };
  },

  async getByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    const response = await apiClient.get<unknown>(
      `/products/${productId}/reviews`,
    );
    const reviews = extractReviews(response.data).map((review) =>
      normalizeReview(review, productId),
    );

    return { data: reviews };
  },

  async markHelpful(
    productId: string,
    reviewId: string,
  ): Promise<ApiResponse<Review>> {
    const response = await apiClient.post<unknown>(
      `/products/${productId}/reviews/${reviewId}/helpful`,
    );
    return {
      data: normalizeReview(unwrapData(response.data) as ApiReview, productId),
    };
  },
};
