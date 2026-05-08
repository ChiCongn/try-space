import { useEffect, useState } from "react";
import { reviewApi } from "../../services/review.api";
import type { RatingSummary, Review } from "../../types";
import { RatingDistribution } from "./RatingDistribution";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);

  useEffect(() => {
    let live = true;

    Promise.all([
      reviewApi.getByProduct(productId),
      reviewApi.getSummary(productId),
    ]).then(([reviewResponse, summaryResponse]) => {
      if (!live) return;
      setReviews(reviewResponse.data);
      setSummary(summaryResponse.data);
    });

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
