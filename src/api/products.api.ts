import { apiClient, mockDelay, useMockApi } from "./client";
import type { ApiResponse, Product } from "../types";
import mockProducts from "../assets/mock-data/products.json";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  materials?: string[];
  query?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export const productsApi = {
  async getAll(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    if (useMockApi) {
      await mockDelay();
      let result = [...(mockProducts as Product[])];
      const query = filters.query ? normalize(filters.query) : "";

      if (filters.category && filters.category !== "all") {
        result = result.filter((product) => product.category === filters.category);
      }

      if (query) {
        result = result.filter(
          (product) =>
            normalize(product.name).includes(query) ||
            normalize(product.collection).includes(query) ||
            product.tags.some((tag) => normalize(tag).includes(query)),
        );
      }

      if (filters.minPrice) {
        result = result.filter(
          (product) => product.basePrice >= Number(filters.minPrice),
        );
      }

      if (filters.maxPrice) {
        result = result.filter(
          (product) => product.basePrice <= Number(filters.maxPrice),
        );
      }

      if (filters.colors?.length) {
        result = result.filter((product) =>
          product.colors.some((color) => filters.colors?.includes(color.id)),
        );
      }

      if (filters.materials?.length) {
        result = result.filter((product) =>
          product.materials.some((material) =>
            filters.materials?.includes(material.id),
          ),
        );
      }

      if (filters.sort === "price_asc") {
        result.sort((left, right) => left.basePrice - right.basePrice);
      }

      if (filters.sort === "price_desc") {
        result.sort((left, right) => right.basePrice - left.basePrice);
      }

      if (filters.sort === "popular") {
        result.sort((left, right) => right.reviewCount - left.reviewCount);
      }

      return {
        data: result,
        pagination: { limit: result.length, page: 1, total: result.length },
      };
    }

    const response = await apiClient.get<ApiResponse<Product[]>>("/products", {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    if (useMockApi) {
      await mockDelay();
      const product = (mockProducts as Product[]).find((item) => item.id === id);

      if (!product) {
        throw { response: { data: { message: "Sản phẩm không tồn tại" } } };
      }

      return { data: product };
    }

    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
};
