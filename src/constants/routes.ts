export const ROUTES = {
  AR: "/ar/:id",
  ACCOUNT: "/account",
  CART: "/cart",
  CATALOG: "/catalog",
  CHECKOUT: "/checkout",
  DESIGNS: "/designs",
  ORDER: "/orders/:id",
  ORDERS: "/orders",
  HOME: "/",
  LOGIN: "/login",
  ORDER_SUCCESS: "/order-success/:orderId",
  PRODUCT: "/products/:id",
  PRODUCTS: "/products",
  REGISTER: "/register",
  SHARED_DESIGN: "/design/:shareToken",
  TRY: "/try",
  WISHLIST: "/wishlist",
} as const;

export const routeTo = {
  ar: (id: string) => `/ar/${id}`,
  design: (shareToken: string) => `/design/${shareToken}`,
  order: (id: string) => `/orders/${id}`,
  orderSuccess: (orderId: string) => `/order-success/${orderId}`,
  product: (id: string) => `/products/${id}`,
} as const;
