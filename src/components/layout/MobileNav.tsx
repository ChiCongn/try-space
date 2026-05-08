import { motion, AnimatePresence } from "framer-motion";
import { Box, House, ScanLine, ShoppingBag, UserRound } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";

const navItems = [
  { to: "/", icon: House, label: "Trang chủ" },
  { to: "/catalog", icon: Box, label: "Khám phá" },
  { to: "/cart", icon: ShoppingBag, label: "Giỏ" },
  { to: "/account", icon: UserRound, label: "Tài khoản" },
] as const;

export function MobileNav() {
  const itemCount = useCartStore((state) => state.itemCount());
  const { pathname } = useLocation();

  return (
    <nav className="bnav" aria-label="Mobile navigation">
      {/* Left group: Home + Catalog */}
      <div className="bnav__group">
        {navItems.slice(0, 2).map(({ to, icon: Icon, label }) => {
          const active =
            pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <NavLink key={to} className="bnav__item" to={to} aria-label={label}>
              <span className="bnav__item-inner">
                {active && (
                  <motion.span
                    className="bnav__pill"
                    layoutId="bnav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  aria-hidden
                  size={20}
                  strokeWidth={active ? 2 : 1.6}
                  style={{ position: "relative", zIndex: 1 }}
                />
              </span>
              <span className="bnav__label">{label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Center: AR CTA */}
      <NavLink
        className={({ isActive }) =>
          `bnav__ar ${isActive ? "bnav__ar--active" : ""}`
        }
        to="/ar/p001"
        aria-label="Xem AR"
      >
        <span className="bnav__ar-ring" aria-hidden />
        <ScanLine size={22} strokeWidth={1.8} aria-hidden />
        <span className="bnav__ar-label">AR</span>
      </NavLink>

      {/* Right group: Wishlist + Cart */}
      <div className="bnav__group">
        {navItems.slice(2).map(({ to, icon: Icon, label }) => {
          const active =
            pathname === to || (to !== "/" && pathname.startsWith(to));
          const showBadge = to === "/cart" && itemCount > 0;
          return (
            <NavLink key={to} className="bnav__item" to={to} aria-label={label}>
              <span className="bnav__item-inner">
                {active && (
                  <motion.span
                    className="bnav__pill"
                    layoutId="bnav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>
                  <Icon aria-hidden size={20} strokeWidth={active ? 2 : 1.6} />
                  <AnimatePresence>
                    {showBadge && (
                      <motion.span
                        animate={{ scale: 1, opacity: 1 }}
                        className="bnav__badge"
                        exit={{ scale: 0, opacity: 0 }}
                        initial={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }}
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
              <span className="bnav__label">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
