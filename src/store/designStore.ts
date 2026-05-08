import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedDesign, SaveDesignPayload } from "../types";

interface DesignStore {
  designs: SavedDesign[];
  addDesign: (payload: SaveDesignPayload) => SavedDesign;
  cloneDesign: (id: string) => SavedDesign | null;
  getByShareToken: (shareToken: string) => SavedDesign | null;
  removeDesign: (id: string) => void;
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      addDesign: (payload) => {
        const now = new Date().toISOString();
        const design: SavedDesign = {
          createdAt: now,
          id: nanoid(),
          name: payload.name ?? `${payload.product.name} custom`,
          notes: payload.notes,
          product: payload.product,
          selectedColor: payload.selectedColor,
          selectedMaterial: payload.selectedMaterial,
          shareToken: nanoid(12),
          thumbnailUrl: payload.thumbnailUrl ?? payload.product.images[0],
          updatedAt: now,
        };
        set({ designs: [design, ...get().designs] });
        return design;
      },
      cloneDesign: (id) => {
        const source = get().designs.find((design) => design.id === id);
        if (!source) return null;
        return get().addDesign({
          name: `${source.name} copy`,
          notes: source.notes,
          product: source.product,
          selectedColor: source.selectedColor,
          selectedMaterial: source.selectedMaterial,
          thumbnailUrl: source.thumbnailUrl,
        });
      },
      designs: [],
      getByShareToken: (shareToken) =>
        get().designs.find((design) => design.shareToken === shareToken) ?? null,
      removeDesign: (id) =>
        set({ designs: get().designs.filter((design) => design.id !== id) }),
    }),
    { name: "tryspace-designs" },
  ),
);
