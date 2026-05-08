import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { ProductCard } from "../components/product/ProductCard";
import { useAuthStore } from "../store/authStore";
import { useWishlistStore } from "../store/wishlistStore";

export function WishlistPage() {
  const user = useAuthStore((state) => state.user);
  const items = useWishlistStore((state) => state.items);

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

      {items.length > 0 ? (
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
