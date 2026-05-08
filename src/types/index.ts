export type Theme = "dark" | "light";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductMaterial {
  id: string;
  name: string;
  surcharge: number;
}

export interface Product {
  id: string;
  name: string;
  collection: string;
  category: "sofa" | "chair" | "table" | "shelf" | "lamp" | "other";
  basePrice: number;
  colors: ProductColor[];
  materials: ProductMaterial[];
  dimensions: { w: number; d: number; h: number };
  modelUrl?: string;
  images: string[];
  arSupported: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedMaterial: ProductMaterial;
  quantity: number;
  finalPrice: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type PaymentMethod = "cod" | "banking" | "momo";

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";

export interface Address {
  recipientName: string;
  recipientPhone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
}
