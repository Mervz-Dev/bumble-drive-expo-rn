import { supabase } from "@/services/supabase";
import { Stack } from "expo-router";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "../global.css";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <Stack initialRouteName="index">
          <Stack.Screen
            name="index"
            options={{ headerShown: false, headerTitle: "Dashboard" }}
          />
          <Stack.Screen
            name="trip-preview"
            options={{ headerShown: false, headerTitle: "Map Pre Book" }}
          />
          <Stack.Screen
            name="(private)/search-destination"
            options={{ headerShown: false, headerTitle: "Search Destination" }}
          />
          <Stack.Screen
            name="(private)/place-confirmation"
            options={{ headerShown: false, headerTitle: "Place Confirmation" }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
