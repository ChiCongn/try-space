import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatVnd } from "../shared/lib/money";
import { useCartStore } from "../stores/cartStore";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <section className="cart-page">
      <div className="page-heading compact">
        <span>Checkout</span>
        <h1>Giỏ hàng</h1>
      </div>

      {items.length > 0 ? (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.product.images[0]} alt="" />
                <div>
                  <h2>{item.product.name}</h2>
                  <p>
                    {item.selectedColor.name} · {item.selectedMaterial.name}
                  </p>
                  <strong>{formatVnd(item.finalPrice)}</strong>
                </div>
                <div className="qty-controls">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >
                    <Plus size={15} />
                  </button>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <h2>Tổng đơn</h2>
            <dl>
              <div>
                <dt>Tạm tính</dt>
                <dd>{formatVnd(total)}</dd>
              </div>
              <div>
                <dt>Phí vận chuyển</dt>
                <dd>Miễn phí</dd>
              </div>
              <div>
                <dt>Tổng cộng</dt>
                <dd>{formatVnd(total)}</dd>
              </div>
            </dl>
            <button className="primary-link" type="button">
              Tiến hành đặt hàng
            </button>
            <Link className="ghost-link" to="/catalog">
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      ) : (
        <div className="empty-panel page-empty">
          <h2>Giỏ hàng trống</h2>
          <p>Khám phá catalog và thêm một món nội thất để thử AR.</p>
          <Link className="primary-link" to="/catalog">
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </section>
  );
}
