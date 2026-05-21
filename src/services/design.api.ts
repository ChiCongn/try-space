import { apiClient } from "./api";
import type { ApiResponse, SavedDesign } from "../types";

export const designApi = {
  async getByShareToken(shareToken: string): Promise<ApiResponse<SavedDesign>> {
    const response = await apiClient.get<ApiResponse<SavedDesign>>(
      `/designs/${shareToken}`,
    );
    return response.data;
  },
};
