import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { routeTo } from "../constants/routes";
import { orderApi } from "../services/order.api";
import { formatVnd } from "../utils/formatPrice";
import { getErrorMessages } from "../utils/errors";
import { useCartStore } from "../store/cartStore";
import type { Address, CreateOrderPayload } from "../types";

const addressSchema = z.object({
  recipientName: z.string().min(2, "Tên người nhận tối thiểu 2 ký tự"),
  recipientPhone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  street: z.string().min(5, "Địa chỉ tối thiểu 5 ký tự"),
  notes: z.string().optional(),
});

const addressFieldLabels: Partial<Record<keyof Address, string>> = {
  district: "quận/huyện",
  province: "tỉnh/thành",
  recipientName: "tên người nhận",
  recipientPhone: "số điện thoại",
  street: "địa chỉ",
  ward: "phường/xã",
};

const provinceOptions = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bắc Ninh",
  "Quảng Ninh",
  "Thanh Hóa",
  "Nghệ An",
  "Thừa Thiên Huế",
  "Khánh Hòa",
  "Đồng Nai",
  "Bình Dương",
  "Bà Rịa - Vũng Tàu",
  "Lâm Đồng",
];

const hanoiDistrictOptions = [
  "Quận Ba Đình",
  "Quận Hoàn Kiếm",
  "Quận Tây Hồ",
  "Quận Long Biên",
  "Quận Cầu Giấy",
  "Quận Đống Đa",
  "Quận Hai Bà Trưng",
  "Quận Hoàng Mai",
  "Quận Thanh Xuân",
  "Quận Nam Từ Liêm",
  "Quận Bắc Từ Liêm",
  "Quận Hà Đông",
  "Huyện Thanh Trì",
  "Huyện Gia Lâm",
  "Huyện Đông Anh",
  "Huyện Sóc Sơn",
  "Huyện Hoài Đức",
  "Huyện Quốc Oai",
  "Huyện Thạch Thất",
  "Huyện Chương Mỹ",
  "Huyện Thanh Oai",
  "Huyện Thường Tín",
  "Huyện Phú Xuyên",
  "Huyện Ứng Hòa",
  "Huyện Mỹ Đức",
  "Huyện Ba Vì",
  "Huyện Phúc Thọ",
  "Huyện Đan Phượng",
  "Huyện Mê Linh",
  "Thị xã Sơn Tây",
];

const hanoiWardOptions = [
  "Phường Cửa Nam",
  "Phường Hàng Bạc",
  "Phường Hàng Bài",
  "Phường Trúc Bạch",
  "Phường Ngọc Hà",
  "Phường Kim Mã",
  "Phường Dịch Vọng",
  "Phường Nghĩa Tân",
  "Phường Trung Hòa",
  "Phường Láng Hạ",
  "Phường Khương Mai",
  "Phường Văn Quán",
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.total());
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<Address>({
    defaultValues: {
      recipientName: "",
      recipientPhone: "",
      province: "",
      district: "",
      ward: "",
      street: "",
      notes: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"cod">("cod");
  const [hasCompletedOrder, setHasCompletedOrder] = useState(false);
  const hasRedirectedEmptyCart = useRef(false);

  useEffect(() => {
    if (
      items.length > 0 ||
      isSubmitting ||
      hasCompletedOrder ||
      hasRedirectedEmptyCart.current
    ) {
      return;
    }

    hasRedirectedEmptyCart.current = true;
    toast.warning("Giỏ hàng đang trống", {
      description: "Vui lòng chọn sản phẩm trước khi thanh toán.",
    });
    navigate("/cart", { replace: true });
  }, [hasCompletedOrder, isSubmitting, items.length, navigate]);

  const onSubmit = async (data: Address) => {
    clearErrors();

    if (items.length === 0) {
      toast.warning("Giỏ hàng đang trống", {
        description: "Vui lòng chọn sản phẩm trước khi thanh toán.",
      });
      navigate("/cart", { replace: true });
      return;
    }

    const parsed = addressSchema.safeParse(data);
    if (!parsed.success) {
      const fields = new Set<string>();

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof Address | undefined;
        if (!field) return;

        fields.add(addressFieldLabels[field] ?? field);
        setError(field, { message: issue.message, type: "manual" });
      });

      toast.error("Vui lòng kiểm tra thông tin giao hàng", {
        description:
          fields.size > 0
            ? `Cần bổ sung/chỉnh sửa: ${Array.from(fields).join(", ")}.`
            : "Dữ liệu không hợp lệ.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateOrderPayload = {
        items,
        shippingAddress: parsed.data,
        paymentMethod: selectedPayment,
      };

      const response = await orderApi.createOrder(payload);
      setHasCompletedOrder(true);
      clearCart();
      toast.success("Đặt hàng thành công!", {
        description: `Mã đơn hàng: ${response.data.id}`,
      });
      navigate(routeTo.orderSuccess(response.data.id), { replace: true });
    } catch (caught) {
      const messages = getErrorMessages(caught, "Đặt hàng thất bại. Vui lòng thử lại.");
      toast.error("Không thể đặt hàng", {
        description: messages.join("\n"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="checkout-page">
      <div className="page-heading compact">
        <span>Checkout</span>
        <h1>Thanh toán</h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
          <section className="form-section">
            <h2>Thông tin giao hàng</h2>
            <div className="form-grid">
              <label className="full-width">
                Tên người nhận
                <input type="text" {...register("recipientName")} />
                {errors.recipientName && (
                  <span className="field-error">{errors.recipientName.message}</span>
                )}
              </label>

              <label className="full-width">
                Số điện thoại
                <input type="tel" {...register("recipientPhone")} />
                {errors.recipientPhone && (
                  <span className="field-error">{errors.recipientPhone.message}</span>
                )}
              </label>

              <label>
                Tỉnh/Thành phố
                <select {...register("province")}>
                  <option value="">Chọn tỉnh/thành</option>
                  {provinceOptions.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <span className="field-error">{errors.province.message}</span>
                )}
              </label>

              <label>
                Quận/Huyện
                <select {...register("district")}>
                  <option value="">Chọn quận/huyện</option>
                  {hanoiDistrictOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <span className="field-error">{errors.district.message}</span>
                )}
              </label>

              <label>
                Phường/Xã
                <select {...register("ward")}>
                  <option value="">Chọn phường/xã</option>
                  {hanoiWardOptions.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
                {errors.ward && (
                  <span className="field-error">{errors.ward.message}</span>
                )}
              </label>

              <label className="full-width">
                Địa chỉ (số nhà, tên đường)
                <input type="text" {...register("street")} placeholder="VD: 123 Nguyễn Huệ" />
                {errors.street && (
                  <span className="field-error">{errors.street.message}</span>
                )}
              </label>

              <label className="full-width">
                Ghi chú (tùy chọn)
                <textarea {...register("notes")} placeholder="VD: Giao giờ hành chính" />
              </label>
            </div>
          </section>

          <section className="form-section">
            <h2>Phương thức thanh toán</h2>
            <div className="payment-methods">
              <label className={`payment-option ${selectedPayment === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  value="cod"
                  checked={selectedPayment === "cod"}
                  onChange={() => setSelectedPayment("cod")}
                />
                <div className="payment-info">
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <p>Tiền mặt khi nhận được hàng</p>
                </div>
              </label>
            </div>
          </section>

          <button className="primary-link" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : `Xác nhận đặt hàng · ${formatVnd(total)}`}
          </button>
        </form>

        <aside className="order-summary">
          <h2>Đơn hàng ({items.length} sản phẩm)</h2>
          <div className="summary-items">
            {items.map((item) => (
              <div className="summary-item" key={item.id}>
                <img src={item.product.images[0]} alt="" />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p>
                    {item.selectedColor.name} · {item.selectedMaterial.name}
                  </p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
                <strong>{formatVnd(item.finalPrice * item.quantity)}</strong>
              </div>
            ))}
          </div>

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
              <dd className="total">{formatVnd(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
