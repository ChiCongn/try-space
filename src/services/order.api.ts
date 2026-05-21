import { apiClient } from "./api";
import { cartApi } from "./cart.api";
import { normalizeProduct } from "./product.api";
import type {
  Address,
  ApiResponse,
  CartItem,
  CreateOrderPayload,
  Order,
  PaymentMethod,
  Product,
  ProductColor,
  ProductMaterial,
} from "../types";
import type { ApiProduct } from "./product.api";

type ApiShippingAddress = Partial<Address> & {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  fullName?: string;
  phone?: string;
};

type ApiOrderItem = Partial<CartItem> & {
  product?: ApiProduct;
  quantity?: number;
  snapshot?: {
    basePrice?: number;
    priceAddon?: number;
    productName?: string;
    thumbnailUrl?: string | null;
    unitPrice?: number;
    variantName?: string | null;
  };
  subtotal?: number;
  unitPrice?: number;
  variant?: {
    hexColor?: string | null;
    id?: string;
    name?: string;
  } | null;
};

type ApiOrder = Omit<Partial<Order>, "items" | "paymentMethod" | "shippingAddress"> & {
  itemCount?: number;
  items?: ApiOrderItem[];
  orderNumber?: string;
  paymentMethod?: string;
  shippingAddress?: ApiShippingAddress;
};

function normalizeShippingAddress(address: ApiShippingAddress = {}): Address {
  const line2Parts =
    address.addressLine2
      ?.split(",")
      .map((part) => part.trim())
      .filter(Boolean) ?? [];
  const district = address.district ?? address.city ?? line2Parts.at(-1) ?? "";
  const ward =
    address.ward ??
    line2Parts.filter((part) => part !== district).join(", ");

  return {
    district,
    notes: address.notes,
    province: address.province ?? "",
    recipientName: address.recipientName ?? address.fullName ?? "",
    recipientPhone: address.recipientPhone ?? address.phone ?? "",
    street: address.street ?? address.addressLine1 ?? "",
    ward,
  };
}

function normalizeOrderProduct(item: ApiOrderItem): Product {
  const product: ApiProduct = item.product ?? {};

  return normalizeProduct({
    ...product,
    basePrice:
      product.basePrice ??
      item.snapshot?.basePrice ??
      item.unitPrice ??
      item.snapshot?.unitPrice ??
      0,
    images:
      product.images ??
      [product.thumbnailUrl, item.snapshot?.thumbnailUrl].filter(
        (image): image is string => Boolean(image),
      ),
    name: product.name ?? item.snapshot?.productName ?? "Sản phẩm",
    thumbnailUrl: product.thumbnailUrl ?? item.snapshot?.thumbnailUrl ?? undefined,
  });
}

function normalizeOrderSelection(item: ApiOrderItem) {
  const variantName = item.variant?.name ?? item.snapshot?.variantName ?? "Tiêu chuẩn";
  const color: ProductColor = item.variant?.hexColor
    ? {
        hex: item.variant.hexColor,
        id: item.variant.id ?? variantName,
        name: variantName,
      }
    : { hex: "#d6d0c4", id: "default", name: "Mặc định" };
  const material: ProductMaterial = {
    id: item.variant?.hexColor ? "default" : item.variant?.id ?? "default",
    name: item.variant?.hexColor ? "Tiêu chuẩn" : variantName,
    surcharge: item.snapshot?.priceAddon ?? 0,
  };

  return { color, material };
}

function normalizeOrderItem(item: ApiOrderItem): CartItem {
  if (item.product?.images?.length && item.selectedColor && item.selectedMaterial) {
    return item as CartItem;
  }

  const product = normalizeOrderProduct(item);
  const { color, material } = normalizeOrderSelection(item);

  return {
    finalPrice: item.finalPrice ?? item.unitPrice ?? item.snapshot?.unitPrice ?? 0,
    id: item.id ?? `${product.id}-${item.variant?.id ?? "default"}`,
    product,
    quantity: item.quantity ?? 1,
    selectedColor: color,
    selectedMaterial: material,
  };
}

function normalizeOrder(order: ApiOrder): Order {
  return {
    createdAt: order.createdAt ?? "",
    id: order.id ?? "",
    items: order.items?.map(normalizeOrderItem) ?? [],
    paymentMethod: (order.paymentMethod?.toLowerCase() ?? "cod") as PaymentMethod,
    shippingAddress: normalizeShippingAddress(order.shippingAddress),
    shippingFee: order.shippingFee ?? 0,
    status: order.status ?? "pending",
    subtotal: order.subtotal ?? 0,
    total: order.total ?? 0,
    updatedAt: order.updatedAt ?? order.createdAt ?? "",
    userId: order.userId ?? "",
  };
}

export const orderApi = {
  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
    const addressLine2 = [payload.shippingAddress.ward, payload.shippingAddress.district]
      .filter(Boolean)
      .join(", ");
    const shippingAddress = {
      addressLine1: payload.shippingAddress.street.trim(),
      addressLine2: addressLine2 || undefined,
      city: payload.shippingAddress.district.trim(),
      fullName: payload.shippingAddress.recipientName.trim(),
      phone: payload.shippingAddress.recipientPhone.trim(),
      province: payload.shippingAddress.province.trim(),
    };
    const note = payload.shippingAddress.notes?.trim() || undefined;
    const paymentMethod = payload.paymentMethod.toUpperCase();
    const body = {
      note,
      paymentMethod,
      shippingAddress,
    };

    await cartApi.syncCart(payload.items);
    const response = await apiClient.post<ApiResponse<ApiOrder>>("/orders", body);
    return { ...response.data, data: normalizeOrder(response.data.data) };
  },

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await apiClient.get<ApiResponse<ApiOrder[]>>("/orders");
    return {
      ...response.data,
      data: response.data.data.map(normalizeOrder),
    };
  },

  async getOrderDetail(orderId: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.get<ApiResponse<ApiOrder>>(`/orders/${orderId}`);
    return { ...response.data, data: normalizeOrder(response.data.data) };
  },
};
