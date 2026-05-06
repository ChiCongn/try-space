import type { Product, ProductVariant } from "../types";
import { formatVnd } from "../../../shared/lib/money";

type ProductHeroProps = {
  product: Product;
  selectedVariant: ProductVariant;
};

export function ProductHero({ product, selectedVariant }: ProductHeroProps) {
  const finalPrice = product.basePrice + selectedVariant.priceAddon;

  return (
    <section className="product-hero" aria-labelledby="product-title">
      <p className="eyebrow">TrySpace AR preview</p>
      <h1 id="product-title">{product.name}</h1>
      <p className="tagline">{product.tagline}</p>
      <p className="description">{product.description}</p>
      <div className="price-row">
        <span>{formatVnd(finalPrice)}</span>
        <small>
          {selectedVariant.name} · {selectedVariant.colorName}
        </small>
      </div>
    </section>
  );
}
