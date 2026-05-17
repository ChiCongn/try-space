import { apiClient } from "./api";
import type { ApiResponse } from "../types";
import { imageUploadSchema } from "../utils/schemas";

export const uploadApi = {
  async image(file: File): Promise<ApiResponse<{ url: string }>> {
    imageUploadSchema.parse(file);

    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      "/upload/image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
