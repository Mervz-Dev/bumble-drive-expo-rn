import { PostHog } from "posthog-react-native";

export const posthog = new PostHog(
  "phc_z0MpoLYQpmPaYrqgmGjfqCeS3TaGPsEWcpYRFztF4Ea",
  {
    host: "https://app.posthog.com",
    captureAppLifecycleEvents: true,
  }
);
