import { Star } from "lucide-react";

interface RatingInputProps {
  onChange: (rating: number) => void;
  value: number;
}

export function RatingInput({ onChange, value }: RatingInputProps) {
  return (
    <div className="rating-input" role="radiogroup" aria-label="Chọn số sao">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          aria-checked={value === rating}
          key={rating}
          role="radio"
          type="button"
          onClick={() => onChange(rating)}
        >
          <Star fill={rating <= value ? "currentColor" : "none"} size={18} />
        </button>
      ))}
    </div>
  );
}
