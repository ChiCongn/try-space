import type { ProductVariant } from "../../types/product.types";
import { formatVnd } from "../../utils/formatPrice";

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
};

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  return (
    <section className="variant-selector" aria-labelledby="variant-title">
      <div className="section-heading">
        <h2 id="variant-title">Màu và vật liệu</h2>
        <span>{selectedVariant.colorName}</span>
      </div>

      <div className="variant-options" role="list">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariant.id;

          return (
            <button
              aria-pressed={isSelected}
              className="variant-option"
              key={variant.id}
              onClick={() => onSelectVariant(variant)}
              type="button"
            >
              <span
                aria-hidden="true"
                className="variant-swatch"
                style={{ backgroundColor: variant.hexColor }}
              />
              <span className="variant-copy">
                <strong>{variant.name}</strong>
                <small>
                  {variant.priceAddon > 0
                    ? `+ ${formatVnd(variant.priceAddon)}`
                    : "Giá cơ bản"}
                </small>
              </span>
            </button>
          );
        })}
      </div>

      <p className="variant-note">{selectedVariant.finishNote}</p>
    </section>
  );
}
