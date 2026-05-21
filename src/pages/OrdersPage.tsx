import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "../components/ui";
import { orderApi } from "../services/order.api";
import { getErrorMessages } from "../utils/errors";
import { formatDateTime } from "../utils/formatDate";
import { formatVnd } from "../utils/formatPrice";
import type { Order } from "../types";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let live = true;
    orderApi
      .getOrders()
      .then((response) => {
        if (live) setOrders(response.data);
      })
      .catch((caught) => {
        if (!live) return;

        const messages = getErrorMessages(caught, "Không thể tải đơn hàng.");
        setOrders([]);
        toast.error("Không thể tải đơn hàng", {
          description: messages.join("\n"),
        });
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
          description="Các đơn hàng từ backend sẽ xuất hiện tại đây sau checkout."
          icon={<Package size={34} />}
          title="Chưa có đơn hàng"
        />
      )}
    </section>
  );
}
