import { Link } from "react-router-dom";

export function RegisterForm() {
  return (
    <p className="auth-helper">
      Tạo tài khoản tại <Link to="/register">trang đăng ký</Link>.
    </p>
  );
}
