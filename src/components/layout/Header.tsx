import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../ui";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export function Header() {
  const itemCount = useCartStore((state) => state.itemCount());
  const openCart = useCartStore((state) => state.openCart);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close user menu on route change
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setUserMenuOpen(false), 0);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  // Shadow/border on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  return (
    <header className={`hdr ${scrolled ? "hdr--scrolled" : ""}`}>
      {/* Logo */}
      <Link className="hdr__logo" to="/" aria-label="TrySpace home">
        <span className="hdr__logo-mark" aria-hidden>
          ◈
        </span>
        TrySpace
      </Link>

      {/* Desktop nav
      <nav className="hdr__nav" aria-label="Main navigation">
        <NavLink
          className={({ isActive }) =>
            `hdr__nav-link ${isActive ? "hdr__nav-link--active" : ""}`
          }
          to="/catalog"
        >
          Catalog
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `hdr__nav-link ${isActive ? "hdr__nav-link--active" : ""}`
          }
          to="/designs"
        >
          Thiết kế của tôi
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `hdr__nav-link ${isActive ? "hdr__nav-link--active" : ""}`
          }
          to="/orders"
        >
          Đơn hàng
        </NavLink>
      </nav> */}

      {/* Right tools */}
      <div className="hdr__tools">

        <ThemeToggle />

        {/* Divider */}
        <span className="hdr__sep" aria-hidden />

        {/* Wishlist */}
        <Link className="hdr__icon-btn" to="/wishlist" aria-label="Yêu thích">
          <Heart size={17} strokeWidth={1.8} />
        </Link>

        {/* Cart */}
        <button
          className="hdr__cart-btn"
          onClick={openCart}
          type="button"
          aria-label={`Giỏ hàng${itemCount > 0 ? `, ${itemCount} sản phẩm` : ""}`}
        >
          <ShoppingBag size={17} strokeWidth={1.8} />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                className="hdr__cart-badge"
                exit={{ scale: 0, opacity: 0 }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User area */}
        {user ? (
          <div className="hdr__user" ref={userMenuRef}>
            <button
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              className="hdr__user-btn"
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
            >
              {user.avatar ? (
                <img alt="" className="hdr__avatar" src={user.avatar} />
              ) : (
                <span className="hdr__avatar hdr__avatar--fallback">
                  {user.name?.[0]?.toUpperCase() ?? <UserRound size={14} />}
                </span>
              )}
              <span className="hdr__user-name hide-sm">{user.name}</span>
              <ChevronDown
                aria-hidden
                size={13}
                strokeWidth={2.5}
                style={{
                  transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 200ms ease",
                }}
              />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="hdr__user-menu"
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <div className="hdr__user-menu-info">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="hdr__user-menu-divider" />
                  <Link className="hdr__user-menu-item" to="/account">
                    <UserRound size={14} strokeWidth={2} />
                    Tài khoản
                  </Link>
                  <button
                    className="hdr__user-menu-item hdr__user-menu-item--danger"
                    type="button"
                    onClick={logout}
                  >
                    <LogOut size={14} strokeWidth={2} />
                    Đăng xuất
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link className="hdr__login-btn" to="/login">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
