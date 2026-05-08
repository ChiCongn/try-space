import { apiClient, mockDelay, useMockApi } from "./api";
import type { ApiResponse } from "../types";
import { imageUploadSchema } from "../utils/schemas";

export const uploadApi = {
  async image(file: File): Promise<ApiResponse<{ url: string }>> {
    imageUploadSchema.parse(file);

    if (useMockApi) {
      await mockDelay(250);
      return { data: { url: URL.createObjectURL(file) } };
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      "/uploads/images",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
