import { Outlet } from "react-router-dom";
import { CartSheet } from "../cart/CartSheet";
import { ErrorBoundary } from "../ui";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="shell-main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <MobileNav />
      <CartSheet />
    </div>
  );
}
