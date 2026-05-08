import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ARPage } from "./pages/ARPage";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { RegisterPage } from "./pages/RegisterPage";
import { WishlistPage } from "./pages/WishlistPage";

export const router = createBrowserRouter([
  { element: <LandingPage />, path: "/" },
  { element: <LoginPage />, path: "/login" },
  { element: <RegisterPage />, path: "/register" },
  {
    element: <AppShell />,
    children: [
      { element: <CatalogPage />, path: "/catalog" },
      { element: <Navigate replace to="/catalog" />, path: "/products" },
      { element: <ProductDetailPage />, path: "/products/:id" },
      { element: <ARPage />, path: "/ar/:id" },
      { element: <Navigate replace to="/ar/p001" />, path: "/try" },
      { element: <CartPage />, path: "/cart" },
      { element: <CheckoutPage />, path: "/checkout" },
      { element: <WishlistPage />, path: "/wishlist" },
    ],
  },
  { element: <OrderSuccessPage />, path: "/order-success/:orderId" },
  { element: <Navigate replace to="/" />, path: "*" },
]);
