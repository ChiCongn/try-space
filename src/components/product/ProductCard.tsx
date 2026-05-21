import { motion } from "framer-motion";
import { Heart, ShoppingBag, Scan } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { wishlistApi } from "../../services/wishlist.api";
import { formatVnd } from "../../utils/formatPrice";
import { getErrorMessages } from "../../utils/errors";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const isInCart = useCartStore((state) =>
    state.items.some((item) => item.product.id === product.id),
  );
  const addWishlist = useWishlistStore((state) => state.add);
  const isWished = useWishlistStore((state) => state.isWished(product.id));
  const removeWishlist = useWishlistStore((state) => state.remove);
  const [isWishlistSaving, setIsWishlistSaving] = useState(false);

  const firstColor = product.colors[0];
  const firstMaterial = product.materials[0];

  async function handleToggleWishlist(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (isWishlistSaving) return;

    const nextWished = !isWished;
    setIsWishlistSaving(true);

    if (nextWished) {
      addWishlist(product);
    } else {
      removeWishlist(product.id);
    }

    try {
      if (nextWished) {
        await wishlistApi.add(product.id);
      } else {
        await wishlistApi.remove(product.id);
      }

      toast.success(nextWished ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích", {
        description: product.name,
      });
    } catch (caught) {
      if (nextWished) {
        removeWishlist(product.id);
      } else {
        addWishlist(product);
      }

      const messages = getErrorMessages(caught, "Không thể cập nhật yêu thích.");
      toast.error("Không thể cập nhật yêu thích", {
        description: messages.join("\n"),
      });
    } finally {
      setIsWishlistSaving(false);
    }
  }

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
          disabled={isWishlistSaving}
          type="button"
          whileTap={{ scale: 0.82 }}
          onClick={handleToggleWishlist}
        >
          <Heart size={15} fill={isWished ? "currentColor" : "none"} />
        </motion.button>

        {/* AR badge — bottom-left corner */}
        {product.arSupported && (
          <button
            aria-label={`Thử AR ${product.name}`}
            className="pcard__ar-badge"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              navigate(
                `/ar/${product.id}?color=${firstColor.id}&material=${firstMaterial.id}`,
              );
            }}
          >
            <Scan size={11} strokeWidth={2.5} />
            AR
          </button>
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
