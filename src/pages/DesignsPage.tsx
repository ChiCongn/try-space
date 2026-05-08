import { Cuboid } from "lucide-react";
import { Link } from "react-router-dom";
import { DesignGrid } from "../components/design/DesignGrid";
import { EmptyState } from "../components/ui";
import { useDesignStore } from "../store/designStore";

export function DesignsPage() {
  const designs = useDesignStore((state) => state.designs);

  return (
    <section className="simple-page">
      <div className="page-heading compact">
        <span>Designs</span>
        <h1>Thiết kế đã lưu</h1>
      </div>
      {designs.length > 0 ? (
        <DesignGrid designs={designs} />
      ) : (
        <EmptyState
          action={<Link className="primary-link" to="/catalog">Chọn sản phẩm</Link>}
          description="Lưu cấu hình màu, vật liệu và chia sẻ cho người khác."
          icon={<Cuboid size={34} />}
          title="Chưa có thiết kế"
        />
      )}
    </section>
  );
}
