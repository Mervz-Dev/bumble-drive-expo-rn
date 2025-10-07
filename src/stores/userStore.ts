import { User } from "@/types/app/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: User.User | null;
  setUser: (user: Partial<User.User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (partialUser) => {
        const current = get().user ?? {};
        set({
          user: { ...current, ...partialUser } as User.User,
        });
      },

      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
