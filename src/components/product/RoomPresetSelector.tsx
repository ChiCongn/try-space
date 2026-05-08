import type { RoomPreset } from "../../types/product.types";

type RoomPresetSelectorProps = {
  presets: RoomPreset[];
  selectedPreset: RoomPreset;
  onSelectPreset: (preset: RoomPreset) => void;
};

export function RoomPresetSelector({
  presets,
  selectedPreset,
  onSelectPreset,
}: RoomPresetSelectorProps) {
  return (
    <section className="room-presets" aria-labelledby="room-presets-title">
      <div className="section-heading">
        <h2 id="room-presets-title">Bối cảnh phòng</h2>
        <span>{selectedPreset.area}</span>
      </div>
      <div className="room-preset-list">
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPreset.id;

          return (
            <button
              aria-pressed={isSelected}
              className="room-preset"
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
            >
              <span
                aria-hidden="true"
                className="wall-swatch"
                style={{ backgroundColor: preset.wallColor }}
              />
              <span>
                <strong>{preset.name}</strong>
                <small>
                  {preset.floorTone} · {preset.lighting}
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
