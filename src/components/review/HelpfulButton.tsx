import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { reviewApi } from "../../services/review.api";

interface HelpfulButtonProps {
  count: number;
  reviewId: string;
}

export function HelpfulButton({ count, reviewId }: HelpfulButtonProps) {
  const [helpfulCount, setHelpfulCount] = useState(count);
  const [clicked, setClicked] = useState(false);

  async function handleClick() {
    if (clicked) return;
    setClicked(true);
    setHelpfulCount((value) => value + 1);
    await reviewApi.markHelpful(reviewId).catch(() => {
      setClicked(false);
      setHelpfulCount((value) => value - 1);
    });
  }

  return (
    <button className="helpful-button" disabled={clicked} type="button" onClick={handleClick}>
      <ThumbsUp size={14} />
      Hữu ích ({helpfulCount})
    </button>
  );
}
