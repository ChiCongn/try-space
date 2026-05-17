import { apiClient } from "./api";
import type { ApiResponse, SavedDesign, SaveDesignPayload } from "../types";

export const designApi = {
  async clone(id: string): Promise<ApiResponse<SavedDesign>> {
    const response = await apiClient.post<ApiResponse<SavedDesign>>(
      `/designs/${id}/clone`,
    );
    return response.data;
  },

  async create(payload: SaveDesignPayload): Promise<ApiResponse<SavedDesign>> {
    const response = await apiClient.post<ApiResponse<SavedDesign>>("/designs", payload);
    return response.data;
  },

  async getByShareToken(shareToken: string): Promise<ApiResponse<SavedDesign>> {
    const response = await apiClient.get<ApiResponse<SavedDesign>>(
      `/designs/shared/${shareToken}`,
    );
    return response.data;
  },

  async getMine(): Promise<ApiResponse<SavedDesign[]>> {
    const response = await apiClient.get<ApiResponse<SavedDesign[]>>("/designs");
    return response.data;
  },
};
