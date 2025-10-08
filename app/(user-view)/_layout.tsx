import { Stack } from "expo-router";

export default function UserViewLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="search-destination"
        options={{
          headerShown: false,
          headerTitle: "Search Destination",
        }}
      />
      <Stack.Screen
        name="trip-preview"
        options={{ headerShown: false, headerTitle: "Map Pre Book" }}
      />

      <Stack.Screen
        name="place-confirmation"
        options={{
          headerShown: false,
          headerTitle: "Place Confirmation",
        }}
      />
    </Stack>
  );
}
