import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { reviewApi } from "../../services/review.api";
import { getErrorMessages } from "../../utils/errors";

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
    await reviewApi.markHelpful(reviewId).catch((caught) => {
      const messages = getErrorMessages(caught, "Không thể đánh dấu hữu ích.");
      setClicked(false);
      setHelpfulCount((value) => value - 1);
      toast.error("Không thể đánh dấu hữu ích", {
        description: messages.join("\n"),
      });
    });
  }

  return (
    <button className="helpful-button" disabled={clicked} type="button" onClick={handleClick}>
      <ThumbsUp size={14} />
      Hữu ích ({helpfulCount})
    </button>
  );
}
