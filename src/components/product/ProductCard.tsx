import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, View } from "lucide-react";
import { Link } from "react-router-dom";
import { formatVnd } from "../../shared/lib/money";
import { useCartStore } from "../../stores/cartStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWished = useWishlistStore((state) => state.isWished(product.id));
  const firstColor = product.colors[0];
  const firstMaterial = product.materials[0];

  return (
    <motion.article
      animate={{ opacity: 1, scale: 1 }}
      className="app-product-card"
      initial={{ opacity: 0, scale: 0.95 }}
      layout
      transition={{ duration: 0.2 }}
    >
      <Link className="product-card-image" to={`/products/${product.id}`}>
        <img src={product.images[0]} alt={product.name} />
        {product.arSupported ? (
          <span className="ar-badge">
            <View size={13} /> AR
          </span>
        ) : null}
      </Link>

      <div className="product-card-info">
        <div>
          <span className="collection-label">{product.collection}</span>
          <Link to={`/products/${product.id}`}>
            <h3>{product.name}</h3>
          </Link>
        </div>

        <div className="product-card-meta">
          <strong>{formatVnd(product.basePrice)}</strong>
          <span>
            <Star size={13} fill="currentColor" /> {product.rating} ·{" "}
            {product.reviewCount}
          </span>
        </div>

        <div className="swatch-row" aria-label="Màu sắc">
          {product.colors.map((color) => (
            <span
              aria-label={color.name}
              key={color.id}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        <div className="product-card-actions">
          <button
            type="button"
            onClick={() => addItem(product, firstColor, firstMaterial)}
          >
            <ShoppingBag size={15} /> Thêm vào giỏ
          </button>
          <button
            aria-pressed={isWished}
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={isWished ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
