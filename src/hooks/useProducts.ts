import { useEffect, useState } from "react";
import { productApi, type ProductFilters } from "../services/product.api";
import type { Product } from "../types";

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let live = true;
    const nextFilters = JSON.parse(filtersKey) as ProductFilters;

    async function loadProducts() {
      await Promise.resolve();
      if (!live) return;
      setIsLoading(true);

      try {
        const response = await productApi.getAll(nextFilters);
        if (live) setData(response.data);
      } finally {
        if (live) setIsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      live = false;
    };
  }, [filtersKey]);

  return { data, isLoading };
}
