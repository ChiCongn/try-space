import type { Product } from "../types";

export function getProductPriceRange(product: Product) {
  const prices = product.variants.map(
    (variant) => product.basePrice + variant.priceAddon,
  );

  return {
    max: Math.max(...prices),
    min: Math.min(...prices),
  };
}
