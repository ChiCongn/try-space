import { Share2 } from "lucide-react";
import { toast } from "sonner";
import type { SavedDesign } from "../../types";

interface ShareDesignButtonProps {
  design: SavedDesign;
}

export function ShareDesignButton({ design }: ShareDesignButtonProps) {
  async function handleShare() {
    const url = `${window.location.origin}/design/${design.shareToken}`;
    await navigator.clipboard?.writeText(url);
    toast.success("Đã sao chép link chia sẻ");
  }

  return (
    <button className="ghost-link" type="button" onClick={handleShare}>
      <Share2 size={16} />
      Chia sẻ
    </button>
  );
}
