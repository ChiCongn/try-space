import { useParams } from "react-router-dom";
import { Check, Package } from "lucide-react";
import { Link } from "react-router-dom";

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <main className="order-success-page">
      <div className="success-card">
        <div className="success-icon">
          <Check size={48} />
        </div>
        <h1>Đặt hàng thành công!</h1>
        <p>Mã đơn hàng: <strong>{orderId}</strong></p>

        <div className="success-info">
          <Package />
          <div>
            <h3>Thanh toán khi nhận hàng</h3>
            <p>Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng</p>
          </div>
        </div>

        <p className="success-note">
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
        </p>

        <div className="success-actions">
          <Link className="primary-link" to={`/orders/${orderId}`}>
            Xem đơn hàng
          </Link>
          <Link className="primary-link" to="/catalog">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </main>
  );
}
