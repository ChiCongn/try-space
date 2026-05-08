import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useDesignStore } from "../store/designStore";
import { useWishlistStore } from "../store/wishlistStore";

export function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => state.itemCount());
  const designCount = useDesignStore((state) => state.designs.length);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  return (
    <section className="simple-page">
      <div className="page-heading compact">
        <span>Account</span>
        <h1>{user?.name ?? "Tài khoản"}</h1>
        <p>{user?.email}</p>
      </div>
      <div className="account-grid">
        <Link to="/orders"><strong>Đơn hàng</strong><span>Xem lịch sử mua hàng</span></Link>
        <Link to="/designs"><strong>{designCount}</strong><span>Thiết kế đã lưu</span></Link>
        <Link to="/wishlist"><strong>{wishlistCount}</strong><span>Sản phẩm yêu thích</span></Link>
        <Link to="/cart"><strong>{cartCount}</strong><span>Sản phẩm trong giỏ</span></Link>
      </div>
      <button className="ghost-link" type="button" onClick={logout}>
        Đăng xuất
      </button>
    </section>
  );
}
