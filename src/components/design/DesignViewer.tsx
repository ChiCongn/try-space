import { Link } from "react-router-dom";
import type { SavedDesign } from "../../types";
import { ShareDesignButton } from "./ShareDesignButton";

interface DesignViewerProps {
  design: SavedDesign;
}

export function DesignViewer({ design }: DesignViewerProps) {
  return (
    <section className="design-viewer">
      <img alt="" src={design.thumbnailUrl ?? design.product.images[0]} />
      <div>
        <span>Shared design</span>
        <h1>{design.name}</h1>
        <p>
          {design.product.name} với màu {design.selectedColor.name} và vật liệu{" "}
          {design.selectedMaterial.name}.
        </p>
        <div className="design-card__actions">
          <Link className="primary-link" to={`/ar/${design.product.id}?color=${design.selectedColor.id}&material=${design.selectedMaterial.id}`}>
            Mở AR
          </Link>
          <ShareDesignButton design={design} />
        </div>
      </div>
    </section>
  );
}
