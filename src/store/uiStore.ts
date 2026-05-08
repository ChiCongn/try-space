import { create } from "zustand";

interface UiStore {
  activeModal: string | null;
  openModal: (modal: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiStore>()((set) => ({
  activeModal: null,
  closeModal: () => set({ activeModal: null }),
  openModal: (activeModal) => set({ activeModal }),
}));
