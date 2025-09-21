import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "../global.css";

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
            name="search-destination"
            options={{ headerShown: false, headerTitle: "Search Destination" }}
          />
          <Stack.Screen
            name="place-confirmation"
            options={{ headerShown: false, headerTitle: "Place Confirmation" }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
