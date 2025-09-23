import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  isFirstTimeLoggedIn: boolean;
  setFirstTimeLoggedIn: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isFirstTimeLoggedIn: true,

      setFirstTimeLoggedIn: () => set({ isFirstTimeLoggedIn: false }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
