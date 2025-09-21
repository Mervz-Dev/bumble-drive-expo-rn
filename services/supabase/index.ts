import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://mxyeffhximdfzulwksos.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eWVmZmh4aW1kZnp1bHdrc29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MTc3MTcsImV4cCI6MjA3Mzk5MzcxN30.xinac3p1Y9_bqIriOUVijbwEcNLE5R_BmT6u4CVwHDs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
