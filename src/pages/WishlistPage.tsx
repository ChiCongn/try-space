import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "../components/product/ProductCard";
import { wishlistApi } from "../services/wishlist.api";
import { useAuthStore } from "../store/authStore";
import { useWishlistStore } from "../store/wishlistStore";
import { getErrorMessages } from "../utils/errors";

export function WishlistPage() {
  const user = useAuthStore((state) => state.user);
  const items = useWishlistStore((state) => state.items);
  const setWishlistItems = useWishlistStore((state) => state.setItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let live = true;

    wishlistApi
      .getMine()
      .then((response) => {
        if (live) setWishlistItems(response.data);
      })
      .catch((caught) => {
        if (!live) return;

        const messages = getErrorMessages(caught, "Không thể tải yêu thích.");
        toast.error("Không thể tải yêu thích", {
          description: messages.join("\n"),
        });
      })
      .finally(() => {
        if (live) setIsLoading(false);
      });

    return () => {
      live = false;
    };
  }, [setWishlistItems]);

  return (
    <section className="wishlist-page">
      <div className="page-heading compact">
        <span>Saved designs</span>
        <h1>Yêu thích</h1>
      </div>

      {!user ? (
        <div className="notice-banner">
          Đăng nhập để đồng bộ danh sách yêu thích khi có backend thật.
          <Link to="/login">Đăng nhập</Link>
        </div>
      ) : null}

      {isLoading ? (
        <div className="empty-panel page-empty">
          <p>Đang tải danh sách yêu thích...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="product-grid-app">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      ) : (
        <div className="empty-panel page-empty">
          <Heart size={34} />
          <h2>Chưa có sản phẩm yêu thích</h2>
          <p>Lưu các mẫu bạn muốn thử lại hoặc chia sẻ với người khác.</p>
          <Link className="primary-link" to="/catalog">
            Khám phá ngay
          </Link>
        </div>
      )}
    </section>
  );
}
