import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem } from "../types";

interface WishlistStore {
  items: WishlistItem[];
  add: (product: Product) => void;
  toggle: (product: Product) => void;
  isWished: (productId: string) => boolean;
  remove: (productId: string) => void;
  setItems: (items: WishlistItem[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      add: (product) => {
        if (get().isWished(product.id)) return;

        set({
          items: [
            ...get().items,
            {
              addedAt: new Date().toISOString(),
              id: nanoid(),
              product,
            },
          ],
        });
      },
      isWished: (productId) =>
        get().items.some((item) => item.product.id === productId),
      items: [],
      remove: (productId) =>
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        }),
      setItems: (items) => set({ items }),
      toggle: (product) => {
        const exists = get().items.find(
          (item) => item.product.id === product.id,
        );

        if (exists) {
          get().remove(product.id);
          return;
        }

        get().add(product);
      },
    }),
    { name: "tryspace-wishlist" },
  ),
);
