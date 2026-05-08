import { motion } from "framer-motion";
import { Heart, ShoppingBag, Scan } from "lucide-react";
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
  const isInCart = useCartStore((state) =>
    state.items.some((item) => item.product.id === product.id),
  );
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWished = useWishlistStore((state) => state.isWished(product.id));

  const firstColor = product.colors[0];
  const firstMaterial = product.materials[0];

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="pcard"
      initial={{ opacity: 0, y: 16 }}
      layout
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Image ── */}
      <Link className="pcard__img-wrap" to={`/products/${product.id}`}>
        <img src={product.images[0]} alt={product.name} />

        {/* Wishlist button — top-right corner over image */}
        <motion.button
          aria-label={isWished ? "Bỏ yêu thích" : "Yêu thích"}
          aria-pressed={isWished}
          className={`pcard__wish ${isWished ? "pcard__wish--active" : ""}`}
          type="button"
          whileTap={{ scale: 0.82 }}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
        >
          <Heart size={15} fill={isWished ? "currentColor" : "none"} />
        </motion.button>

        {/* AR badge — bottom-left corner */}
        {product.arSupported && (
          <span className="pcard__ar-badge">
            <Scan size={11} strokeWidth={2.5} />
            AR
          </span>
        )}
      </Link>

      {/* ── Body ── */}
      <div className="pcard__body">
        {/* Collection label */}
        <span className="pcard__label">{product.collection}</span>

        {/* Name */}
        <Link className="pcard__name-link" to={`/products/${product.id}`}>
          <h3 className="pcard__name">{product.name}</h3>
        </Link>

        {/* Color swatches */}
        <div aria-label="Màu sắc" className="pcard__swatches">
          {product.colors.slice(0, 5).map((color) => (
            <span
              aria-label={color.name}
              className="pcard__swatch"
              key={color.id}
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="pcard__swatch-more">
              +{product.colors.length - 5}
            </span>
          )}
        </div>

        {/* Price row + Add to cart */}
        <div className="pcard__footer">
          <div className="pcard__price-block">
            <strong className="pcard__price">
              {formatVnd(product.basePrice)}
            </strong>
            <span className="pcard__rating">
              ★ {product.rating}
              <span className="pcard__review-count">
                ({product.reviewCount})
              </span>
            </span>
          </div>

          <motion.button
            aria-label={
              isInCart ? "Sản phẩm đã có trong giỏ hàng" : "Thêm vào giỏ hàng"
            }
            aria-pressed={isInCart}
            className={`pcard__cart-btn ${isInCart ? "pcard__cart-btn--selected" : ""}`}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => addItem(product, firstColor, firstMaterial)}
          >
            <ShoppingBag size={15} strokeWidth={2} />
            <span>{isInCart ? "Đã thêm" : "Thêm"}</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
