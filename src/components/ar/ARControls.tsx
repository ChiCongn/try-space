import { RotateCcw, RotateCw, Save } from "lucide-react";
import type { CSSProperties } from "react";
import type { ProductColor, ProductMaterial } from "../../types";

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
      <div className="ar-controls__row">
        <button aria-label="Xoay trái" type="button" onClick={onRotateLeft}>
          <RotateCcw size={17} />
        </button>
        <button aria-label="Xoay phải" type="button" onClick={onRotateRight}>
          <RotateCw size={17} />
        </button>
        <button aria-label="Lưu thiết kế" type="button" onClick={onSave}>
          <Save size={17} />
        </button>
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
          />
        ))}
      </div>
      <select
        aria-label="Vật liệu"
        value={selectedMaterial.id}
        onChange={(event) => {
          const next = materials.find((material) => material.id === event.target.value);
          if (next) onMaterialChange(next);
        }}
      >
        {materials.map((material) => (
          <option key={material.id} value={material.id}>
            {material.name}
          </option>
        ))}
      </select>
    </div>
  );
}
