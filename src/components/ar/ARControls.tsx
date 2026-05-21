import { Check, RotateCcw, RotateCw, Save } from "lucide-react";
import type { CSSProperties } from "react";
import type { ProductColor, ProductMaterial } from "../../types";
import { formatVnd } from "../../utils/formatPrice";

interface ARControlsProps {
  colors: ProductColor[];
  materials: ProductMaterial[];
  onColorChange: (color: ProductColor) => void;
  onMaterialChange: (material: ProductMaterial) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onSave: () => void;
  selectedColor: ProductColor;
  selectedMaterial: ProductMaterial;
}

export function ARControls({
  colors,
  materials,
  onColorChange,
  onMaterialChange,
  onRotateLeft,
  onRotateRight,
  onSave,
  selectedColor,
  selectedMaterial,
}: ARControlsProps) {
  return (
    <div className="ar-controls">
      <section className="ar-controls__section" aria-label="Điều chỉnh model">
        <div className="ar-controls__section-head">
          <span>Căn chỉnh</span>
          <strong>Preview 3D</strong>
        </div>
        <div className="ar-controls__row">
          <button type="button" onClick={onRotateLeft}>
            <RotateCcw size={17} />
            <span>Xoay trái</span>
          </button>
          <button type="button" onClick={onRotateRight}>
            <RotateCw size={17} />
            <span>Xoay phải</span>
          </button>
          <button type="button" onClick={onSave}>
            <Save size={17} />
            <span>Lưu</span>
          </button>
        </div>
      </section>

      <section className="ar-controls__section" aria-label="Chọn màu">
        <div className="ar-controls__section-head">
          <span>Màu hoàn thiện</span>
          <strong>{selectedColor.name}</strong>
        </div>
        <div className="ar-controls__swatches" role="group" aria-label="Màu">
          {colors.map((color) => (
            <button
              aria-label={color.name}
              aria-pressed={selectedColor.id === color.id}
              key={color.id}
              style={{ "--swatch": color.hex } as CSSProperties}
              type="button"
              onClick={() => onColorChange(color)}
            >
              <i aria-hidden />
              <span>{color.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ar-controls__section" aria-label="Chọn vật liệu">
        <div className="ar-controls__section-head">
          <span>Vật liệu</span>
          <strong>{selectedMaterial.name}</strong>
        </div>
        <div
          className="ar-controls__materials"
          role="group"
          aria-label="Vật liệu"
        >
          {materials.map((material) => (
            <button
              aria-pressed={selectedMaterial.id === material.id}
              key={material.id}
              type="button"
              onClick={() => onMaterialChange(material)}
            >
              <span>{material.name}</span>
              {material.surcharge !== 0 ? (
                <small>
                  {material.surcharge > 0 ? "+" : ""}
                  {formatVnd(material.surcharge)}
                </small>
              ) : (
                <small>Giá gốc</small>
              )}
              {selectedMaterial.id === material.id ? (
                <Check aria-hidden size={15} />
              ) : null}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
