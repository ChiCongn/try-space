import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const location = useLocation();

  if (isLoading) {
    return <div className="page-loading">Đang kiểm tra phiên đăng nhập...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <Outlet />;
}
