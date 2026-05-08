import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductColor, ProductMaterial } from "../types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    product: Product,
    color: ProductColor,
    material: ProductMaterial,
    quantity?: number,
  ) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      addItem: (product, color, material, quantity = 1) => {
        const existing = get().items.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedColor.id === color.id &&
            item.selectedMaterial.id === material.id,
        );

        if (existing) {
          set({
            isOpen: true,
            items: get().items.map((item) =>
              item.id === existing.id
                ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
                : item,
            ),
          });
          return;
        }

        const item: CartItem = {
          finalPrice: product.basePrice + material.surcharge,
          id: nanoid(),
          product,
          quantity: Math.min(99, quantity),
          selectedColor: color,
          selectedMaterial: material,
        };

        set({ isOpen: true, items: [...get().items, item] });
      },
      clearCart: () => set({ items: [] }),
      closeCart: () => set({ isOpen: false }),
      isOpen: false,
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      items: [],
      openCart: () => set({ isOpen: true }),
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.finalPrice * item.quantity,
          0,
        ),
      updateQty: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const nextQuantity = Math.min(99, quantity);
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: nextQuantity } : item,
          ),
        });
      },
    }),
    { name: "tryspace-cart" },
  ),
);
