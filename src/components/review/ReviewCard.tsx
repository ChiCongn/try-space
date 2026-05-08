import { formatDate } from "../../utils/formatDate";
import type { Review } from "../../types";
import { HelpfulButton } from "./HelpfulButton";
import { RatingDisplay } from "./RatingDisplay";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="review-card">
      <header>
        <div>
          <strong>{review.userName}</strong>
          <span>{formatDate(review.createdAt)}</span>
        </div>
        <RatingDisplay rating={review.rating} />
      </header>
      <h3>{review.title}</h3>
      <p>{review.content}</p>
      <HelpfulButton count={review.helpfulCount} reviewId={review.id} />
    </article>
  );
}
