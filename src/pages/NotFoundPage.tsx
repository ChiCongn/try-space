import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";

export function NotFoundPage() {
  return (
    <EmptyState
      action={<Link className="primary-link" to="/catalog">Về catalog</Link>}
      description="Đường dẫn này không tồn tại trong TrySpace."
      icon={<SearchX size={34} />}
      title="Không tìm thấy trang"
    />
  );
}
