import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { reviewApi } from "../../services/review.api";
import type { Review } from "../../types";
import { reviewFormSchema } from "../../utils/schemas";
import { RatingInput } from "./RatingInput";

interface ReviewFormProps {
  onCreated: (review: Review) => void;
  productId: string;
}

export function ReviewForm({ onCreated, productId }: ReviewFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = reviewFormSchema.safeParse({ content, rating, title });
    if (!parsed.success) {
      toast.error("Không thể gửi đánh giá", {
        description: parsed.error.issues[0]?.message,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await reviewApi.create({ productId, ...parsed.data });
      onCreated(response.data);
      setContent("");
      setRating(5);
      setTitle("");
      toast.success("Đã gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <RatingInput value={rating} onChange={setRating} />
      <input
        placeholder="Tiêu đề đánh giá"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        placeholder="Chia sẻ trải nghiệm của bạn"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <button className="primary-link" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
}
