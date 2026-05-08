import { Badge } from "../ui";

interface StockBadgeProps {
  inStock: boolean;
}

export function StockBadge({ inStock }: StockBadgeProps) {
  return (
    <Badge tone={inStock ? "success" : "danger"}>
      {inStock ? "Còn hàng" : "Hết hàng"}
    </Badge>
  );
}
