import { z } from "zod";

export const reviewFormSchema = z.object({
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
  rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự"),
});
