/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { ROUTES } from "./constants/routes";

const AccountPage = lazy(() =>
  import("./pages/AccountPage").then((module) => ({ default: module.AccountPage })),
);
const ARPage = lazy(() =>
  import("./pages/ARPage").then((module) => ({ default: module.ARPage })),
);
const CartPage = lazy(() =>
  import("./pages/CartPage").then((module) => ({ default: module.CartPage })),
);
const CatalogPage = lazy(() =>
  import("./pages/CatalogPage").then((module) => ({ default: module.CatalogPage })),
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then((module) => ({ default: module.CheckoutPage })),
);
const DesignsPage = lazy(() =>
  import("./pages/DesignsPage").then((module) => ({ default: module.DesignsPage })),
);
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((module) => ({ default: module.LandingPage })),
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })),
);
const OrderDetailPage = lazy(() =>
  import("./pages/OrderDetailPage").then((module) => ({ default: module.OrderDetailPage })),
);
const OrdersPage = lazy(() =>
  import("./pages/OrdersPage").then((module) => ({ default: module.OrdersPage })),
);
const OrderSuccessPage = lazy(() =>
  import("./pages/OrderSuccessPage").then((module) => ({ default: module.OrderSuccessPage })),
);
const ProductDetailPage = lazy(() =>
  import("./pages/ProductDetailPage").then((module) => ({ default: module.ProductDetailPage })),
);
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage })),
);
const SharedDesignPage = lazy(() =>
  import("./pages/SharedDesignPage").then((module) => ({ default: module.SharedDesignPage })),
);
const WishlistPage = lazy(() =>
  import("./pages/WishlistPage").then((module) => ({ default: module.WishlistPage })),
);

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <>
          <div className="route-progress" />
          <div className="page-loading">Đang tải...</div>
        </>
      }
    >
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  { element: withSuspense(<LandingPage />), path: ROUTES.HOME },
  { element: withSuspense(<LoginPage />), path: ROUTES.LOGIN },
  { element: withSuspense(<RegisterPage />), path: ROUTES.REGISTER },
  { element: withSuspense(<OrderSuccessPage />), path: ROUTES.ORDER_SUCCESS },
  {
    element: <Layout />,
    children: [
      { element: withSuspense(<CatalogPage />), path: ROUTES.CATALOG },
      { element: <Navigate replace to={ROUTES.CATALOG} />, path: ROUTES.PRODUCTS },
      { element: withSuspense(<ProductDetailPage />), path: ROUTES.PRODUCT },
      { element: withSuspense(<ARPage />), path: ROUTES.AR },
      { element: withSuspense(<SharedDesignPage />), path: ROUTES.SHARED_DESIGN },
      { element: <Navigate replace to="/ar/ghe-eames-replica" />, path: ROUTES.TRY },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { element: withSuspense(<AccountPage />), path: ROUTES.ACCOUNT },
          { element: withSuspense(<CartPage />), path: ROUTES.CART },
          { element: withSuspense(<CheckoutPage />), path: ROUTES.CHECKOUT },
          { element: withSuspense(<DesignsPage />), path: ROUTES.DESIGNS },
          { element: withSuspense(<OrderDetailPage />), path: ROUTES.ORDER },
          { element: withSuspense(<OrdersPage />), path: ROUTES.ORDERS },
          { element: withSuspense(<WishlistPage />), path: ROUTES.WISHLIST },
        ],
      },
    ],
  },
  { element: withSuspense(<NotFoundPage />), path: "*" },
]);
