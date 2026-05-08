import type { CSSProperties } from "react";
import type { ProductColor } from "../../types";

interface ColorSwatchProps {
  color: ProductColor;
}

export function ColorSwatch({ color }: ColorSwatchProps) {
  return (
    <span
      aria-label={color.name}
      className="color-swatch"
      style={{ "--swatch": color.hex } as CSSProperties}
      title={color.name}
    />
  );
}
