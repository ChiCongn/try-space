export const ROUTES = {
  AR: "/ar/:id",
  CART: "/cart",
  CATALOG: "/catalog",
  CHECKOUT: "/checkout",
  HOME: "/",
  LOGIN: "/login",
  ORDER_SUCCESS: "/order-success/:orderId",
  PRODUCT: "/products/:id",
  PRODUCTS: "/products",
  REGISTER: "/register",
  TRY: "/try",
  WISHLIST: "/wishlist",
} as const;

export const routeTo = {
  ar: (id: string) => `/ar/${id}`,
  orderSuccess: (orderId: string) => `/order-success/${orderId}`,
  product: (id: string) => `/products/${id}`,
} as const;
