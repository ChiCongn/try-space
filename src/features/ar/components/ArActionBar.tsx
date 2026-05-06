type ArActionBarProps = {
  onAddToCart: () => void;
  onSaveDesign: () => void;
  onTryInRoom: () => void;
};

export function ArActionBar({
  onAddToCart,
  onSaveDesign,
  onTryInRoom,
}: ArActionBarProps) {
  return (
    <div className="ar-action-bar" aria-label="AR product actions">
      <button className="primary-action" type="button" onClick={onTryInRoom}>
        Thử trong phòng
      </button>
      <button className="secondary-action" type="button" onClick={onAddToCart}>
        Thêm vào giỏ
      </button>
      <button className="secondary-action" type="button" onClick={onSaveDesign}>
        Lưu thiết kế demo
      </button>
    </div>
  );
}
