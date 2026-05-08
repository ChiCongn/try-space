import { formatVnd } from "../../utils/formatPrice";

interface PriceDisplayProps {
  price: number;
}

export function PriceDisplay({ price }: PriceDisplayProps) {
  return <strong className="price-display">{formatVnd(price)}</strong>;
}
