import { Copy, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "../../store/cartStore";
import { useDesignStore } from "../../store/designStore";
import { formatDate } from "../../utils/formatDate";
import { formatVnd } from "../../utils/formatPrice";
import type { SavedDesign } from "../../types";
import { ShareDesignButton } from "./ShareDesignButton";

interface DesignCardProps {
  design: SavedDesign;
}

export function DesignCard({ design }: DesignCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cloneDesign = useDesignStore((state) => state.cloneDesign);
  const removeDesign = useDesignStore((state) => state.removeDesign);
  const price = design.product.basePrice + design.selectedMaterial.surcharge;

  return (
    <article className="design-card">
      <Link to={`/design/${design.shareToken}`}>
        <img alt="" src={design.thumbnailUrl ?? design.product.images[0]} />
      </Link>
      <div className="design-card__body">
        <span>{formatDate(design.createdAt)}</span>
        <h3>{design.name}</h3>
        <p>
          {design.product.name} · {design.selectedColor.name} ·{" "}
          {design.selectedMaterial.name}
        </p>
        <strong>{formatVnd(price)}</strong>
      </div>
      <div className="design-card__actions">
        <button
          className="ghost-link"
          type="button"
          onClick={() => {
            addItem(design.product, design.selectedColor, design.selectedMaterial);
            toast.success("Đã thêm thiết kế vào giỏ");
          }}
        >
          <ShoppingBag size={16} />
          Thêm giỏ
        </button>
        <button
          aria-label="Clone thiết kế"
          className="square-action"
          type="button"
          onClick={() => {
            cloneDesign(design.id);
            toast.success("Đã nhân bản thiết kế");
          }}
        >
          <Copy size={16} />
        </button>
        <ShareDesignButton design={design} />
        <button
          aria-label="Xóa thiết kế"
          className="square-action"
          type="button"
          onClick={() => removeDesign(design.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
