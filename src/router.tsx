import { Navigate, createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
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
import { ROUTES } from "./constants/routes";

export const router = createBrowserRouter([
  { element: <LandingPage />, path: ROUTES.HOME },
  { element: <LoginPage />, path: ROUTES.LOGIN },
  { element: <RegisterPage />, path: ROUTES.REGISTER },
  {
    element: <Layout />,
    children: [
      { element: <CatalogPage />, path: ROUTES.CATALOG },
      { element: <Navigate replace to={ROUTES.CATALOG} />, path: ROUTES.PRODUCTS },
      { element: <ProductDetailPage />, path: ROUTES.PRODUCT },
      { element: <ARPage />, path: ROUTES.AR },
      { element: <Navigate replace to="/ar/p001" />, path: ROUTES.TRY },
      { element: <CartPage />, path: ROUTES.CART },
      { element: <CheckoutPage />, path: ROUTES.CHECKOUT },
      { element: <WishlistPage />, path: ROUTES.WISHLIST },
    ],
  },
  { element: <OrderSuccessPage />, path: ROUTES.ORDER_SUCCESS },
  { element: <Navigate replace to={ROUTES.HOME} />, path: "*" },
]);
