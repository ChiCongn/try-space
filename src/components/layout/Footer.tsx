import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="app-footer">
      <nav aria-label="Footer">
        <Link to="/catalog">Catalog</Link>
        <Link to="/designs">Thiết kế</Link>
        <Link to="/orders">Đơn hàng</Link>
      </nav>
    </footer>
  );
}
