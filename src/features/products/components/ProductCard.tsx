import { formatVnd } from "../../../shared/lib/money";
import { getProductPriceRange } from "../lib/pricing";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
};

const categoryLabels: Record<Product["category"], string> = {
  chair: "Ghế",
  lighting: "Đèn",
  ottoman: "Pouf",
  shelf: "Kệ sách",
  sofa: "Sofa",
  table: "Bàn",
};

export function ProductCard({ product }: ProductCardProps) {
  const priceRange = getProductPriceRange(product);
  const priceLabel =
    priceRange.min === priceRange.max
      ? formatVnd(priceRange.min)
      : `${formatVnd(priceRange.min)} - ${formatVnd(priceRange.max)}`;

  return (
    <article className="product-card">
      <a href={`/products/${product.id}`} aria-label={`Xem ${product.name}`}>
        <div className="product-card-media">
          <img src={product.posterUrl} alt="" />
          <span>AR</span>
        </div>
        <div className="product-card-body">
          <div>
            <h2>{product.name}</h2>
            <p>{categoryLabels[product.category]} · {product.variants[0].materialName}</p>
          </div>
          <div className="product-card-meta">
            <strong>{priceLabel}</strong>
            <span>{product.roomFit}</span>
          </div>
          <div className="product-card-swatches" aria-label="Màu có sẵn">
            {product.variants.map((variant) => (
              <span
                aria-label={variant.colorName}
                key={variant.id}
                style={{ backgroundColor: variant.hexColor }}
              />
            ))}
          </div>
        </div>
      </a>
    </article>
  );
}
