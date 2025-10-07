import { updateUserById } from "@/services/supabase/users";
import { User } from "@/types/app/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: User.User | null;
  setUser: (user: Partial<User.User>) => void;
  clearUser: () => void;
  updateName: (name: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (partialUser) => {
        const current = get().user ?? ({} as User.User);
        set({
          user: { ...current, ...partialUser },
        });
      },
      updateName: async (name: string) => {
        try {
          const current = get().user ?? ({} as User.User);
          console.log(name, current?.id);
          await updateUserById({ name }, current?.id);
          set({
            user: {
              ...current,
              name,
            },
          });
        } catch (error) {
          console.error("[updateName] error: ", error);
        }
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
