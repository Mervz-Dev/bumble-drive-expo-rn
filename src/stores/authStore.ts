import { posthog } from "@/services/posthog";
import { supabase } from "@/services/supabase";
import { sendOtp, verifyOtp } from "@/services/supabase/sms";
import { getUserById } from "@/services/supabase/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { useUserStore } from "./userStore";

interface AuthState {
  session: Session | null;
  _hydrated: boolean;
  setSession: (session: Session | null) => void;
  initAuth: () => void;
  logout: () => Promise<void>;
  sendOtpToPhone: (phone: string) => Promise<void>;
  signInWithOtp: (otp: string, phone: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    session: null,
    _hydrated: false,

    setSession: (session) => set({ session }),

    initAuth: async () => {
      try {
        const { data } = await supabase.auth.getSession();
        set({ session: data.session, _hydrated: true });

        supabase.auth.onAuthStateChange(async (_event, session) => {
          try {
            if (session?.user?.id) {
              const user = await getUserById(session?.user?.id);
              useUserStore.getState().setUser(user);
              posthog.identify(session?.user?.id);
            }

            set({ session });
          } catch (error) {
            console.error("[getUserById] error: ", error);
            posthog.reset();
          }
        });
      } catch (error) {
        console.error("[getSession] error: ", error);
      }
    },

    signInWithOtp: async (otp, phone) => {
      try {
        const res = await verifyOtp(otp, phone);

        console.log(res.data, " data here");

        if (res.data.success) {
          await supabase.auth.setSession({
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
          });
        }
      } catch (error) {
        // handle on UI
        throw error;
      }
    },
    sendOtpToPhone: async (phone: string) => {
      try {
        await sendOtp(phone);
      } catch (error) {
        // handle on UI
        throw error;
      }
    },
    logout: async () => {
      try {
        await supabase.auth.signOut();

        set({ session: null });
        useUserStore.getState().clearUser();

        await AsyncStorage.removeItem("supabase.auth.token");

        console.log("✅ User logged out completely");
        posthog.reset();
      } catch (error) {
        console.error("❌ Logout error:", error);
      }
    },
  };
});
