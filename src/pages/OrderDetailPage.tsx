import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderApi } from "../services/order.api";
import { formatDateTime } from "../utils/formatDate";
import { formatVnd } from "../utils/formatPrice";
import type { Order } from "../types";

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    let live = true;
    orderApi.getOrderDetail(id).then((response) => {
      if (live) setOrder(response.data);
    }).catch(() => setOrder(null));
    return () => {
      live = false;
    };
  }, [id]);

  if (!order) {
    return (
      <div className="empty-panel page-empty">
        <h2>Không tìm thấy đơn hàng</h2>
        <Link className="primary-link" to="/orders">Về đơn hàng</Link>
      </div>
    );
  }

  return (
    <section className="simple-page">
      <Link className="ghost-link" to="/orders"><ArrowLeft size={16} />Đơn hàng</Link>
      <div className="page-heading compact">
        <span>{formatDateTime(order.createdAt)}</span>
        <h1>{order.id}</h1>
      </div>
      <div className="checkout-layout">
        <div className="order-list">
          {order.items.map((item) => (
            <article className="summary-item" key={item.id}>
              <img alt="" src={item.product.images[0]} />
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p>{item.selectedColor.name} · {item.selectedMaterial.name}</p>
                <p>Số lượng: {item.quantity}</p>
              </div>
              <strong>{formatVnd(item.finalPrice * item.quantity)}</strong>
            </article>
          ))}
        </div>
        <aside className="order-summary">
          <h2>Thông tin giao hàng</h2>
          <p>{order.shippingAddress.recipientName}</p>
          <p>{order.shippingAddress.recipientPhone}</p>
          <p>
            {order.shippingAddress.street}, {order.shippingAddress.ward},{" "}
            {order.shippingAddress.district}, {order.shippingAddress.province}
          </p>
          <dl>
            <div><dt>Trạng thái</dt><dd>{order.status}</dd></div>
            <div><dt>Tổng cộng</dt><dd className="total">{formatVnd(order.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
