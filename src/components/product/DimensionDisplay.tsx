import type { Product } from "../../types";

interface DimensionDisplayProps {
  dimensions: Product["dimensions"];
}

export function DimensionDisplay({ dimensions }: DimensionDisplayProps) {
  return (
    <dl className="dimension-display">
      <div><dt>Rộng</dt><dd>{dimensions.w} cm</dd></div>
      <div><dt>Sâu</dt><dd>{dimensions.d} cm</dd></div>
      <div><dt>Cao</dt><dd>{dimensions.h} cm</dd></div>
    </dl>
  );
}
