import type { Product, ProductVariant, RoomPreset } from "../types";

type ProductConfidencePanelProps = {
  product: Product;
  roomPreset: RoomPreset;
  selectedVariant: ProductVariant;
};

export function ProductConfidencePanel({
  product,
  roomPreset,
  selectedVariant,
}: ProductConfidencePanelProps) {
  const footprint = (
    (product.dimensions.width * product.dimensions.depth) /
    10000
  ).toFixed(2);

  return (
    <section className="confidence-panel" aria-labelledby="confidence-title">
      <div className="section-heading">
        <h2 id="confidence-title">Độ phù hợp</h2>
        <span>Demo estimate</span>
      </div>
      <div className="confidence-grid">
        <div>
          <strong>92%</strong>
          <span>Tỉ lệ phòng</span>
        </div>
        <div>
          <strong>{footprint}m2</strong>
          <span>Footprint</span>
        </div>
        <div>
          <strong>{selectedVariant.colorName}</strong>
          <span>Đang xem</span>
        </div>
      </div>
      <p>{roomPreset.fitNote}</p>
    </section>
  );
}
