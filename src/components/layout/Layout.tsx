import { Outlet } from "react-router-dom";
import { CartSheet } from "../cart/CartSheet";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="shell-main">
        <Outlet />
      </main>
      <MobileNav />
      <CartSheet />
    </div>
  );
}
