import { Stack } from "expo-router";

export default function DriverOnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="basic-info" />
    </Stack>
  );
}
