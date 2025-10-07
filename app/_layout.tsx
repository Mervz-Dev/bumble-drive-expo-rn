import { posthog } from "@/services/posthog";
import { supabase } from "@/services/supabase";
import { useAuthStore } from "@/stores/authStore";
import { Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { LoadingProvider } from "@/components/loader";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import "../global.css";

export default function AppLayout() {
  const { initAuth, session, _hydrated } = useAuthStore();
  const { user } = useUserStore();
  const { isFirstTimeLoggedIn } = useAppStore();

  useEffect(() => {
    initAuth();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!_hydrated) {
    return null;
  }

  return (
    <PostHogProvider client={posthog} debug>
      <LoadingProvider>
        <GestureHandlerRootView className="flex-1">
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Protected guard={isFirstTimeLoggedIn}>
                <Stack.Screen
                  name="index"
                  options={{ headerShown: false, headerTitle: "Landing Page" }}
                />
              </Stack.Protected>

              <Stack.Protected guard={!!session}>
                <Stack.Protected guard={!user?.name}>
                  <Stack.Screen
                    name="private/enter-name"
                    options={{
                      headerShown: false,
                      headerTitle: "Search Destination",
                    }}
                  />
                </Stack.Protected>

                <Stack.Screen
                  name="private/search-destination"
                  options={{
                    headerShown: false,
                    headerTitle: "Search Destination",
                  }}
                />
                <Stack.Screen
                  name="private/trip-preview"
                  options={{ headerShown: false, headerTitle: "Map Pre Book" }}
                />

                <Stack.Screen
                  name="private/place-confirmation"
                  options={{
                    headerShown: false,
                    headerTitle: "Place Confirmation",
                  }}
                />
              </Stack.Protected>

              <Stack.Protected guard={!session}>
                <Stack.Screen
                  name="login"
                  options={{ headerShown: false, headerTitle: "Login" }}
                />
              </Stack.Protected>
            </Stack>
          </BottomSheetModalProvider>
          <Toast />
        </GestureHandlerRootView>
      </LoadingProvider>
    </PostHogProvider>
  );
}
