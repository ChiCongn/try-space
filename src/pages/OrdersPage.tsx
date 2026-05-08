import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";
import { orderApi } from "../services/order.api";
import { formatDateTime } from "../utils/formatDate";
import { formatVnd } from "../utils/formatPrice";
import type { Order } from "../types";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let live = true;
    orderApi.getOrders().then((response) => {
      if (live) setOrders(response.data);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <section className="simple-page">
      <div className="page-heading compact">
        <span>Orders</span>
        <h1>Đơn hàng</h1>
      </div>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <Link className="order-row" key={order.id} to={`/orders/${order.id}`}>
              <div>
                <strong>{order.id}</strong>
                <span>{formatDateTime(order.createdAt)} · {order.status}</span>
              </div>
              <strong>{formatVnd(order.total)}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          action={<Link className="primary-link" to="/catalog">Mua sắm</Link>}
          description="Các đơn hàng mock sẽ xuất hiện tại đây sau checkout."
          icon={<Package size={34} />}
          title="Chưa có đơn hàng"
        />
      )}
    </section>
  );
}
