import { useEffect, useState } from "react";
import { productApi } from "../services/product.api";
import type { Product } from "../types";

export function useProduct(id?: string) {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    let live = true;

    async function loadProduct(productId: string) {
      await Promise.resolve();
      if (!live) return;
      setIsLoading(true);

      try {
        const response = await productApi.getById(productId);
        if (live) setData(response.data);
      } catch {
        if (live) setData(null);
      } finally {
        if (live) setIsLoading(false);
      }
    }

    void loadProduct(id);
    return () => {
      live = false;
    };
  }, [id]);

  return { data, isLoading };
}
