import { Link } from "react-router-dom";

export function LoginForm() {
  return (
    <p className="auth-helper">
      Dùng trang <Link to="/login">đăng nhập</Link> để tiếp tục.
    </p>
  );
}
