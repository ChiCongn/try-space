type TryInRoomGuideProps = {
  canActivateAR: boolean;
  lastStatus: string;
};

export function TryInRoomGuide({
  canActivateAR,
  lastStatus,
}: TryInRoomGuideProps) {
  return (
    <section className="try-room-guide" aria-labelledby="try-room-title">
      <div className="section-heading">
        <h2 id="try-room-title">Thử trong phòng</h2>
        <span>{canActivateAR ? "Sẵn sàng AR" : "3D fallback"}</span>
      </div>
      <div className="try-room-status">
        <span
          aria-hidden="true"
          className={canActivateAR ? "status-dot ready" : "status-dot"}
        />
        <p>{lastStatus}</p>
      </div>
      <ol>
        <li>Chọn màu/vật liệu trước khi mở AR.</li>
        <li>Nhấn "Thử trong phòng" và cho phép mở trải nghiệm AR.</li>
        <li>Quét chậm mặt sàn, sau đó đặt ghế vào vị trí mong muốn.</li>
      </ol>
    </section>
  );
}
