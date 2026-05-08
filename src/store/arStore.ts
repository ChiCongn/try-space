import { create } from "zustand";
import type { ArSessionStatus, ProductColor, ProductMaterial } from "../types";

interface ArStore {
  selectedColor: ProductColor | null;
  selectedMaterial: ProductMaterial | null;
  status: ArSessionStatus;
  rotation: number;
  setSelection: (color: ProductColor, material: ProductMaterial) => void;
  setStatus: (status: ArSessionStatus) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  reset: () => void;
}

export const useArStore = create<ArStore>()((set) => ({
  reset: () =>
    set({
      rotation: 0,
      selectedColor: null,
      selectedMaterial: null,
      status: "inactive",
    }),
  rotateLeft: () => set((state) => ({ rotation: state.rotation - 15 })),
  rotateRight: () => set((state) => ({ rotation: state.rotation + 15 })),
  rotation: 0,
  selectedColor: null,
  selectedMaterial: null,
  setSelection: (selectedColor, selectedMaterial) =>
    set({ selectedColor, selectedMaterial }),
  setStatus: (status) => set({ status }),
  status: "inactive",
}));
