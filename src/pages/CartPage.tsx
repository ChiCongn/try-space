import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatVnd } from "../shared/lib/money";
import { useCartStore } from "../stores/cartStore";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleRemoveItem = (id: string, productName: string) => {
    removeItem(id);
    toast.success("Đã xóa sản phẩm", {
      description: productName,
    });
  };

  const handleDecreaseQty = (id: string, quantity: number, productName: string) => {
    if (quantity <= 1) {
      removeItem(id);
      toast.info("Sản phẩm đã được xóa khỏi giỏ", {
        description: productName,
      });
      return;
    }

    updateQty(id, quantity - 1);
  };

  const handleIncreaseQty = (id: string, quantity: number, productName: string) => {
    updateQty(id, quantity + 1);
    toast.success("Đã cập nhật số lượng", {
      description: productName,
    });
  };

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
                    onClick={() =>
                      handleDecreaseQty(
                        item.id,
                        item.quantity,
                        item.product.name,
                      )
                    }
                  >
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleIncreaseQty(
                        item.id,
                        item.quantity,
                        item.product.name,
                      )
                    }
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id, item.product.name)}
                  >
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
            <Link className="primary-link" to="/checkout">
              Tiến hành đặt hàng
            </Link>
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
