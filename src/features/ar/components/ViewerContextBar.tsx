import type { ProductVariant, RoomPreset } from "../../products/types";

type ViewerContextBarProps = {
  canActivateAR: boolean;
  roomPreset: RoomPreset;
  selectedVariant: ProductVariant;
};

export function ViewerContextBar({
  canActivateAR,
  roomPreset,
  selectedVariant,
}: ViewerContextBarProps) {
  return (
    <div className="viewer-context-bar" aria-label="Viewer context">
      <div>
        <span className={canActivateAR ? "status-pill ready" : "status-pill"}>
          {canActivateAR ? "AR ready" : "3D mode"}
        </span>
        <span className="context-text">{roomPreset.name}</span>
      </div>
      <div>
        <span
          aria-hidden="true"
          className="mini-swatch"
          style={{ backgroundColor: selectedVariant.hexColor }}
        />
        <span className="context-text">{selectedVariant.name}</span>
      </div>
    </div>
  );
}
