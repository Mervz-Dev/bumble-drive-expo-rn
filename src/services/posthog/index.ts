import config from "@/config";
import { PostHog } from "posthog-react-native";

export const posthog = new PostHog(config.posthog.apiKey, {
  host: config.posthog.host,
  captureAppLifecycleEvents: true,
});
