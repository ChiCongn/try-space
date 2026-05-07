import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { CartDrawer } from "./CartDrawer";
import { Header } from "./Header";

export function AppShell() {
  return (
    <div className="app-shell">
      <Header />
      <main className="shell-main">
        <Outlet />
      </main>
      <BottomNav />
      <CartDrawer />
    </div>
  );
}
