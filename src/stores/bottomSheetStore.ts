import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { create } from "zustand";

type BottomSheetStore = {
  refs: Record<string, BottomSheetModal | null>;
  setRef: (key: string, ref: BottomSheetModal | null) => void;
  open: (key: string) => void;
  close: (key: string) => void;
};

export const useBottomSheetStore = create<BottomSheetStore>((set, get) => ({
  refs: {},
  setRef: (key, ref) =>
    set((state) => ({
      refs: { ...state.refs, [key]: ref },
    })),
  open: (key) => get().refs[key]?.present(),
  close: (key) => get().refs[key]?.dismiss(),
}));
