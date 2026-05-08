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
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export interface ApiErrorResponse {
  code?: string;
  message: string;
  statusCode?: number;
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

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  helpfulCount: number;
  createdAt: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  title: string;
  content: string;
}

export interface RatingSummary {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface SavedDesign {
  id: string;
  name: string;
  product: Product;
  selectedColor: ProductColor;
  selectedMaterial: ProductMaterial;
  shareToken: string;
  thumbnailUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveDesignPayload {
  name?: string;
  product: Product;
  selectedColor: ProductColor;
  selectedMaterial: ProductMaterial;
  thumbnailUrl?: string;
  notes?: string;
}

export type ArSessionStatus =
  | "inactive"
  | "loading"
  | "active"
  | "placed"
  | "error";
