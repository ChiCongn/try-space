import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { formatVnd } from "../../utils/formatPrice";
import { useCartStore } from "../../store/cartStore";

export function CartSheet() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.total());

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

  const handleRemoveItem = (id: string, productName: string) => {
    removeItem(id);
    toast.success("Đã xóa sản phẩm", {
      description: productName,
    });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="drawer-overlay" role="presentation" onClick={closeCart}>
          <motion.aside
            animate={{ opacity: 1, x: 0, y: 0 }}
            className="cart-drawer"
            exit={{ opacity: 0, x: 48, y: 24 }}
            initial={{ opacity: 0, x: 80, y: 40 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.22, ease: "easeOut" }}
            aria-label="Cart drawer"
          >
            <div className="drawer-header">
              <div>
                <span>TrySpace cart</span>
                <h2>Giỏ hàng</h2>
              </div>
              <button type="button" onClick={closeCart} aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {items.length > 0 ? (
              <div className="drawer-items">
                {items.map((item) => (
                  <article className="drawer-item" key={item.id}>
                    <img src={item.product.images[0]} alt="" />
                    <div>
                      <h3>{item.product.name}</h3>
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
                        aria-label="Giảm số lượng"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateQty(item.id, item.quantity + 1);
                          toast.success("Đã cập nhật số lượng", {
                            description: item.product.name,
                          });
                        }}
                        aria-label="Tăng số lượng"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(item.id, item.product.name)
                        }
                        aria-label="Xóa sản phẩm"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="drawer-empty">
                Giỏ hàng trống. Hãy chọn một mẫu nội thất để thử AR.
              </div>
            )}

            <div className="drawer-summary">
              <span>Tạm tính</span>
              <strong>{formatVnd(total)}</strong>
            </div>
            <Link className="primary-link" to="/cart" onClick={closeCart}>
              Xem giỏ hàng
            </Link>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
