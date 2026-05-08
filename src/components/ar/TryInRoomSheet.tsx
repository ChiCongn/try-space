type TryInRoomSheetProps = {
  canActivateAR: boolean;
  isLaunching: boolean;
  onClose: () => void;
  onStartAR: () => void;
};

export function TryInRoomSheet({
  canActivateAR,
  isLaunching,
  onClose,
  onStartAR,
}: TryInRoomSheetProps) {
  return (
    <div className="try-room-overlay" role="presentation">
      <section
        aria-labelledby="try-room-sheet-title"
        aria-modal="true"
        className="try-room-sheet"
        role="dialog"
      >
        <div className="sheet-header">
          <div>
            <p className="eyebrow">AR room preview</p>
            <h2 id="try-room-sheet-title">Chuẩn bị thử trong phòng</h2>
          </div>
          <button
            aria-label="Đóng hướng dẫn thử trong phòng"
            className="icon-button"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {canActivateAR ? (
          <div className="sheet-body">
            <p>
              Để có kết quả ổn định, đứng ở nơi đủ sáng và hướng camera xuống
              mặt sàn trong vài giây đầu.
            </p>
            <ul>
              <li>Di chuyển điện thoại chậm để nhận diện mặt phẳng.</li>
              <li>Đặt ghế ở vùng trống, sau đó đi quanh để xem tỉ lệ.</li>
              <li>Nếu AR đóng lại, bạn vẫn có thể tiếp tục xem 3D trên web.</li>
            </ul>
          </div>
        ) : (
          <div className="sheet-body sheet-warning">
            <p>
              Thiết bị hoặc trình duyệt hiện tại chưa sẵn sàng mở AR. Bạn vẫn
              có thể xoay, phóng to và xem sản phẩm bằng viewer 3D.
            </p>
            <ul>
              <li>Android: thử Chrome mới nhất với Google Play Services for AR.</li>
              <li>iOS: thử Safari trên iPhone/iPad hỗ trợ Quick Look.</li>
            </ul>
          </div>
        )}

        <div className="sheet-actions">
          <button className="secondary-action" type="button" onClick={onClose}>
            Xem 3D thôi
          </button>
          <button
            className="primary-action"
            disabled={!canActivateAR || isLaunching}
            type="button"
            onClick={onStartAR}
          >
            {isLaunching ? "Đang mở AR..." : "Bắt đầu AR"}
          </button>
        </div>
      </section>
    </div>
  );
}
