import { apiClient, mockDelay, useMockApi } from "./api";
import { useDesignStore } from "../store/designStore";
import type { ApiResponse, SavedDesign, SaveDesignPayload } from "../types";

export const designApi = {
  async clone(id: string): Promise<ApiResponse<SavedDesign>> {
    if (useMockApi) {
      await mockDelay(150);
      const design = useDesignStore.getState().cloneDesign(id);
      if (!design) throw new Error("Design not found");
      return { data: design };
    }

    const response = await apiClient.post<ApiResponse<SavedDesign>>(
      `/designs/${id}/clone`,
    );
    return response.data;
  },

  async create(payload: SaveDesignPayload): Promise<ApiResponse<SavedDesign>> {
    if (useMockApi) {
      await mockDelay(150);
      return { data: useDesignStore.getState().addDesign(payload) };
    }

    const response = await apiClient.post<ApiResponse<SavedDesign>>("/designs", payload);
    return response.data;
  },

  async getByShareToken(shareToken: string): Promise<ApiResponse<SavedDesign>> {
    if (useMockApi) {
      await mockDelay(150);
      const design = useDesignStore.getState().getByShareToken(shareToken);
      if (!design) throw new Error("Design not found");
      return { data: design };
    }

    const response = await apiClient.get<ApiResponse<SavedDesign>>(
      `/designs/shared/${shareToken}`,
    );
    return response.data;
  },

  async getMine(): Promise<ApiResponse<SavedDesign[]>> {
    if (useMockApi) {
      await mockDelay(150);
      const data = useDesignStore.getState().designs;
      return { data, pagination: { limit: data.length, page: 1, total: data.length } };
    }

    const response = await apiClient.get<ApiResponse<SavedDesign[]>>("/designs");
    return response.data;
  },
};
