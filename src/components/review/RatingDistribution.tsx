import type { RatingSummary } from "../../types";

interface RatingDistributionProps {
  summary: RatingSummary;
}

export function RatingDistribution({ summary }: RatingDistributionProps) {
  return (
    <div className="rating-distribution">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = summary.distribution[rating as 1 | 2 | 3 | 4 | 5];
        const width = summary.total ? (count / summary.total) * 100 : 0;
        return (
          <div className="rating-distribution__row" key={rating}>
            <span>{rating} sao</span>
            <div>
              <i style={{ width: `${width}%` }} />
            </div>
            <span>{count}</span>
          </div>
        );
      })}
    </div>
  );
}
