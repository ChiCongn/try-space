import { useEffect, useState } from "react";
import { productApi } from "../../services/product.api";
import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    let live = true;
    productApi
      .getAll({ category: product.category, limit: 4 })
      .then((response) => {
        if (!live) return;
        setItems(response.data.filter((item) => item.id !== product.id).slice(0, 4));
      })
      .catch(() => setItems([]));

    return () => {
      live = false;
    };
  }, [product]);

  if (items.length === 0) return null;

  return (
    <section className="related-section">
      <div className="review-section__header">
        <div>
          <span>Related</span>
          <h2>Sản phẩm liên quan</h2>
        </div>
      </div>
      <div className="product-grid-app">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
