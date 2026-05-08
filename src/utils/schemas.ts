import { z } from "zod";

export const imageUploadSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Chỉ hỗ trợ JPG, PNG hoặc WebP",
  );

export const reviewFormSchema = z.object({
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
  rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự"),
});
