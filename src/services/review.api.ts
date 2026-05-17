import { apiClient } from "./api";
import type { ApiResponse, CreateReviewPayload, RatingSummary, Review } from "../types";

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

function isEndpointMiss(caught: unknown) {
  if (!isRecord(caught) || !isRecord(caught.response)) return false;
  const status = caught.response.status;
  return status === 404 || status === 405;
}

function isEndpointMissStatus(status: number) {
  return status === 404 || status === 405;
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
    id: review.id ?? `${productId ?? review.productId ?? "review"}-${review.createdAt ?? ""}`,
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

function emptyDistribution(): RatingSummary["distribution"] {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
}

function buildSummary(reviews: Review[]): RatingSummary {
  const distribution = emptyDistribution();

  reviews.forEach((review) => {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribution[rating] += 1;
  });

  const total = reviews.length;
  const average = total
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : 0;

  return { average, distribution, total };
}

function normalizeSummary(payload: unknown): RatingSummary {
  const data = unwrapData(payload);
  if (!isRecord(data)) return buildSummary([]);

  const distribution = emptyDistribution();
  const sourceDistribution = isRecord(data.distribution)
    ? data.distribution
    : isRecord(data.ratingDistribution)
      ? data.ratingDistribution
      : {};

  ([1, 2, 3, 4, 5] as const).forEach((rating) => {
    distribution[rating] = Number(sourceDistribution[rating] ?? 0);
  });

  return {
    average: Number(data.average ?? data.averageRating ?? 0),
    distribution,
    total: Number(data.total ?? data.totalReviews ?? data.count ?? 0),
  };
}

async function getReviewList(productId: string) {
  try {
    return await apiClient.get<unknown>(`/products/${productId}/reviews`);
  } catch (caught) {
    if (!isEndpointMiss(caught)) throw caught;
  }

  try {
    return await apiClient.get<unknown>(`/reviews/product/${productId}`);
  } catch (caught) {
    if (!isEndpointMiss(caught)) throw caught;
  }

  return apiClient.get<unknown>("/reviews", { params: { productId } });
}

async function getReviewSummary(productId: string) {
  const candidates = [
    { url: `/products/${productId}/reviews/summary` },
    { url: `/reviews/product/${productId}/summary` },
    { params: { productId }, url: "/reviews/summary" },
  ];

  for (const candidate of candidates) {
    const response = await apiClient.get<unknown>(candidate.url, {
      params: candidate.params,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || isEndpointMissStatus(status),
    });

    if (!isEndpointMissStatus(response.status)) {
      return response;
    }
  }

  return null;
}

export const reviewApi = {
  async create(payload: CreateReviewPayload): Promise<ApiResponse<Review>> {
    try {
      const response = await apiClient.post<unknown>("/reviews", payload);
      return { data: normalizeReview(unwrapData(response.data) as ApiReview, payload.productId) };
    } catch (caught) {
      if (!isEndpointMiss(caught)) throw caught;
    }

    const { productId, ...body } = payload;
    const response = await apiClient.post<unknown>(
      `/products/${productId}/reviews`,
      body,
    );
    return { data: normalizeReview(unwrapData(response.data) as ApiReview, productId) };
  },

  async getByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    const response = await getReviewList(productId);
    const reviews = extractReviews(response.data).map((review) =>
      normalizeReview(review, productId),
    );

    return { data: reviews };
  },

  async getSummary(productId: string): Promise<ApiResponse<RatingSummary>> {
    const response = await getReviewSummary(productId);
    if (response) {
      return { data: normalizeSummary(response.data) };
    }

    const reviewsResponse = await reviewApi.getByProduct(productId);
    return { data: buildSummary(reviewsResponse.data) };
  },

  async markHelpful(reviewId: string): Promise<ApiResponse<Review>> {
    try {
      const response = await apiClient.post<unknown>(`/reviews/${reviewId}/helpful`);
      return { data: normalizeReview(unwrapData(response.data) as ApiReview) };
    } catch (caught) {
      if (!isEndpointMiss(caught)) throw caught;
    }

    const response = await apiClient.post<unknown>(`/reviews/${reviewId}/like`);
    return { data: normalizeReview(unwrapData(response.data) as ApiReview) };
  },
};
