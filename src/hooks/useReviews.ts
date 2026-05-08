import { useEffect, useState } from "react";
import { reviewApi } from "../services/review.api";
import type { Review } from "../types";

export function useReviews(productId?: string) {
  const [data, setData] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(productId));

  useEffect(() => {
    if (!productId) return;
    let live = true;

    async function loadReviews(nextProductId: string) {
      await Promise.resolve();
      if (!live) return;
      setIsLoading(true);

      try {
        const response = await reviewApi.getByProduct(nextProductId);
        if (live) setData(response.data);
      } finally {
        if (live) setIsLoading(false);
      }
    }

    void loadReviews(productId);
    return () => {
      live = false;
    };
  }, [productId]);

  return { data, isLoading };
}
