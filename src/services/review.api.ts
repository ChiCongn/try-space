import { apiClient, mockDelay, useMockApi } from "./api";
import type { ApiResponse, CreateReviewPayload, RatingSummary, Review } from "../types";

const mockReviews: Review[] = [
  {
    content: "Màu sắc lên trong viewer khá sát ảnh thật, kích thước AR dễ hình dung.",
    createdAt: "2026-04-18T09:30:00.000Z",
    helpfulCount: 12,
    id: "r001",
    productId: "p001",
    rating: 5,
    title: "Dễ quyết định trước khi mua",
    userId: "u1",
    userName: "Minh Trần",
  },
  {
    content: "Model tải ổn trên điện thoại, phần chọn vật liệu nên có thêm ảnh cận.",
    createdAt: "2026-04-22T15:20:00.000Z",
    helpfulCount: 7,
    id: "r002",
    productId: "p001",
    rating: 4,
    title: "Trải nghiệm AR tốt",
    userId: "u2",
    userName: "Lan Anh",
  },
];

function getSummary(reviews: Review[]): RatingSummary {
  const distribution: RatingSummary["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    distribution[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
  });

  const total = reviews.length;
  const average = total
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : 0;

  return { average, distribution, total };
}

export const reviewApi = {
  async create(payload: CreateReviewPayload): Promise<ApiResponse<Review>> {
    if (useMockApi) {
      await mockDelay(250);
      const review: Review = {
        content: payload.content,
        createdAt: new Date().toISOString(),
        helpfulCount: 0,
        id: `r${Date.now()}`,
        productId: payload.productId,
        rating: payload.rating,
        title: payload.title,
        userId: "mock-user",
        userName: "Bạn",
      };
      mockReviews.unshift(review);
      return { data: review };
    }

    const response = await apiClient.post<ApiResponse<Review>>("/reviews", payload);
    return response.data;
  },

  async getByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    if (useMockApi) {
      await mockDelay(250);
      const data = mockReviews.filter((review) => review.productId === productId);
      return { data, pagination: { limit: data.length, page: 1, total: data.length } };
    }

    const response = await apiClient.get<ApiResponse<Review[]>>(
      `/products/${productId}/reviews`,
    );
    return response.data;
  },

  async getSummary(productId: string): Promise<ApiResponse<RatingSummary>> {
    if (useMockApi) {
      await mockDelay(150);
      const reviews = mockReviews.filter((review) => review.productId === productId);
      return { data: getSummary(reviews) };
    }

    const response = await apiClient.get<ApiResponse<RatingSummary>>(
      `/products/${productId}/reviews/summary`,
    );
    return response.data;
  },

  async markHelpful(reviewId: string): Promise<ApiResponse<Review>> {
    if (useMockApi) {
      await mockDelay(120);
      const review = mockReviews.find((item) => item.id === reviewId);
      if (!review) throw new Error("Review not found");
      review.helpfulCount += 1;
      return { data: review };
    }

    const response = await apiClient.post<ApiResponse<Review>>(
      `/reviews/${reviewId}/helpful`,
    );
    return response.data;
  },
};
