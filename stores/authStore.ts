import { supabase } from "@/services/supabase";
import { Auth } from "@/types/app/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  session: Session | null;
  _hydrated: boolean;
  setSession: (session: Session | null) => void;
  initAuth: () => void;
  logout: () => Promise<void>;
  signInWithEmail: (params: Auth.EmailAuth) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    session: null,
    _hydrated: false,

    setSession: (session) => set({ session }),

    initAuth: async () => {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, _hydrated: true });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session });
      });
    },

    signInWithEmail: async (params) => {
      const { email, password } = params;
      if (!email || !password) {
        throw new Error("Email and password are required for email login");
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.log(error, "error");
        throw new Error(`${error.message}`);
      }
    },
    signInWithGoogle: async () => {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.type === "cancelled") {
        return;
      }

      const { idToken } = await GoogleSignin.getTokens();

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) throw new Error(error?.message);
    },

    logout: async () => {
      try {
        await supabase.auth.signOut();

        set({ session: null });

        await AsyncStorage.removeItem("supabase.auth.token");

        console.log("✅ User logged out completely");
      } catch (error) {
        console.error("❌ Logout error:", error);
      }
    },
  };
});
