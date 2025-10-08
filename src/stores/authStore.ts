import { PosthogLogger } from "@/services/posthog";
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
  initAuth: () => void;
  logout: () => Promise<void>;
  updateSession: (session: Session | null) => Promise<void>;
  sendOtpToPhone: (phone: string) => Promise<void>;
  signInWithOtp: (otp: string, phone: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  return {
    session: null,
    _hydrated: false,
    initAuth: async () => {
      try {
        const { updateSession } = get();
        const { data } = await supabase.auth.getSession();
        set({ session: data.session, _hydrated: true });

        supabase.auth.onAuthStateChange((_event, session) => {
          updateSession(session);
        });
      } catch (error) {
        console.error("[getSession] error: ", error);
      }
    },
    updateSession: async (session: Session | null) => {
      try {
        if (session?.user?.id) {
          const user = await getUserById(session?.user?.id);
          useUserStore.getState().setUser(user);
          PosthogLogger.identify(session?.user?.id);
        }

        console.log("auth change", session);

        set({ session });
      } catch (error) {
        console.error("[getUserById] error: ", error);
        PosthogLogger.reset();
      }
    },

    signInWithOtp: async (otp, phone) => {
      try {
        const { updateSession } = get();
        const res = await verifyOtp(otp, phone);

        console.log("Session Ready", res.data.success);

        if (res.data.success) {
          await supabase.auth.setSession({
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
          });

          const { data } = await supabase.auth.getSession();

          PosthogLogger.capture("login", {
            user_id: data.session?.user.id || "",
          });

          await updateSession(data.session);
        }
      } catch (error) {
        throw error;
      }
    },
    sendOtpToPhone: async (phone: string) => {
      try {
        await sendOtp(phone);
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      try {
        const { session } = get();
        await supabase.auth.signOut();

        PosthogLogger.capture("logout", {
          user_id: session?.user.id || "",
        });

        set({ session: null });
        useUserStore.getState().clearUser();

        await AsyncStorage.removeItem("supabase.auth.token");

        PosthogLogger.reset();
      } catch (error) {
        console.error("❌ Logout error:", error);
      }
    },
  };
});
