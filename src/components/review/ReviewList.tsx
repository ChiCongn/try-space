import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reviewApi } from "../../services/review.api";
import type { RatingSummary, Review } from "../../types";
import { getErrorMessages } from "../../utils/errors";
import { RatingDistribution } from "./RatingDistribution";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

interface ReviewListProps {
  productId: string;
}

function buildSummary(reviews: Review[]): RatingSummary {
  const distribution: RatingSummary["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((review) => {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribution[rating] += 1;
  });

  const total = reviews.length;
  const average = total
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : 0;

  return { average, distribution, total };
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);

  useEffect(() => {
    let live = true;

    async function loadReviews() {
      try {
        const reviewResponse = await reviewApi.getByProduct(productId);
        if (!live) return;

        setReviews(reviewResponse.data);

        setSummary(buildSummary(reviewResponse.data));
      } catch (caught) {
        if (!live) return;

        const messages = getErrorMessages(caught, "Không thể tải đánh giá.");
        setReviews([]);
        setSummary(null);
        toast.error("Không thể tải đánh giá", {
          description: messages.join("\n"),
        });
      }
    }

    void loadReviews();

    return () => {
      live = false;
    };
  }, [productId]);

  function handleCreated(review: Review) {
    setReviews((items) => [review, ...items]);
    setSummary((current) => {
      if (!current) return current;
      const distribution = { ...current.distribution };
      distribution[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
      const total = current.total + 1;
      const average = (current.average * current.total + review.rating) / total;
      return { average, distribution, total };
    });
  }

  return (
    <section className="review-section">
      <div className="review-section__header">
        <div>
          <span>Reviews</span>
          <h2>Đánh giá sản phẩm</h2>
        </div>
        {summary ? (
          <strong>{summary.average.toFixed(1)} / 5 · {summary.total} đánh giá</strong>
        ) : null}
      </div>

      {summary ? <RatingDistribution summary={summary} /> : null}
      <ReviewForm productId={productId} onCreated={handleCreated} />

      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p className="muted-line">Chưa có đánh giá cho sản phẩm này.</p>
        )}
      </div>
    </section>
  );
}
