import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { ThemeToggle } from "../ui";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";

export function Header() {
  const itemCount = useCartStore((state) => state.itemCount());
  const openCart = useCartStore((state) => state.openCart);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="site-header">
      <Link className="site-logo" to="/" aria-label="TrySpace">
        TrySpace
      </Link>

      <nav className="desktop-nav" aria-label="Main navigation">
        <NavLink to="/catalog">Catalog</NavLink>
        <NavLink to="/wishlist">Thiết kế của tôi</NavLink>
      </nav>

      <div className="header-tools">
        <Link className="icon-action hide-sm" to="/catalog" aria-label="Search">
          <Search size={18} />
        </Link>
        <ThemeToggle />
        <Link className="icon-action" to="/wishlist" aria-label="Wishlist">
          <Heart size={18} />
        </Link>
        <button
          className="icon-action badge-action"
          onClick={openCart}
          type="button"
          aria-label="Open cart"
        >
          <ShoppingBag size={18} />
          {itemCount > 0 ? <span>{itemCount}</span> : null}
        </button>
        {user ? (
          <button className="auth-chip" type="button" onClick={logout}>
            {user.avatar ? <img src={user.avatar} alt="" /> : <UserRound size={16} />}
            {user.name}
          </button>
        ) : (
          <Link className="auth-link" to="/login">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
