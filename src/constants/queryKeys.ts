import type { ProductFilters } from "../services/product.api";

export const queryKeys = {
  cart: {
    me: ["cart", "me"] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    list: (filters?: object) => ["orders", "list", filters] as const,
  },
  products: {
    all: ["products"] as const,
    detail: (idOrSlug: string) => ["products", "detail", idOrSlug] as const,
    list: (filters: ProductFilters) => ["products", "list", filters] as const,
  },
  user: {
    me: ["user", "me"] as const,
  },
  wishlist: {
    me: ["wishlist", "me"] as const,
  },
} as const;
