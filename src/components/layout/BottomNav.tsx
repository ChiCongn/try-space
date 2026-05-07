import { Box, Heart, Home, ShoppingBag, View } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCartStore } from "../../stores/cartStore";

export function BottomNav() {
  const itemCount = useCartStore((state) => state.itemCount());

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <NavLink to="/">
        <Home size={18} />
        Trang chủ
      </NavLink>
      <NavLink to="/catalog">
        <Box size={18} />
        Khám phá
      </NavLink>
      <NavLink to="/ar/p001">
        <View size={18} />
        AR
      </NavLink>
      <NavLink to="/cart" className="bottom-cart-link">
        <ShoppingBag size={18} />
        Giỏ hàng
        {itemCount > 0 ? <span>{itemCount}</span> : null}
      </NavLink>
      <NavLink to="/wishlist">
        <Heart size={18} />
        Tôi
      </NavLink>
    </nav>
  );
}
