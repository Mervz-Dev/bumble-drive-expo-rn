import { Stack } from "expo-router";

export default function UserOnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="enter-name" />
    </Stack>
  );
}
