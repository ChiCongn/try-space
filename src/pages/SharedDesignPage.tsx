import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DesignViewer } from "../components/design/DesignViewer";
import { designApi } from "../services/design.api";
import type { SavedDesign } from "../types";

export function SharedDesignPage() {
  const { shareToken } = useParams();
  const [design, setDesign] = useState<SavedDesign | null>(null);

  useEffect(() => {
    if (!shareToken) return;
    let live = true;
    designApi.getByShareToken(shareToken).then((response) => {
      if (live) setDesign(response.data);
    }).catch(() => setDesign(null));
    return () => {
      live = false;
    };
  }, [shareToken]);

  if (!design) {
    return (
      <div className="empty-panel page-empty">
        <h2>Không tìm thấy thiết kế</h2>
        <p>Link chia sẻ không tồn tại hoặc chỉ có trong trình duyệt đã lưu.</p>
        <Link className="primary-link" to="/catalog">Về catalog</Link>
      </div>
    );
  }

  return <DesignViewer design={design} />;
}
