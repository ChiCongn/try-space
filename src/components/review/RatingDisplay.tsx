import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  size?: number;
}

export function RatingDisplay({ rating, size = 14 }: RatingDisplayProps) {
  return (
    <span className="rating-display" aria-label={`${rating} sao`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          fill={index < Math.round(rating) ? "currentColor" : "none"}
          key={index}
          size={size}
          strokeWidth={1.6}
        />
      ))}
    </span>
  );
}
