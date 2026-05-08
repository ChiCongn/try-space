import { productApi, type ProductFilters } from "./product.api";

export const searchApi = {
  products(filters: ProductFilters) {
    return productApi.getAll(filters);
  },
};
