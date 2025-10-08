import config from "@/config";
import type { PostHogEvent } from "@/types/analytics/events";
import type { EventPropsMap } from "@/types/analytics/events-props";
import { PostHog } from "posthog-react-native";

export const posthogClient = new PostHog(config.posthog.apiKey, {
  host: config.posthog.host,
  captureAppLifecycleEvents: true,
});

export class PosthogLogger {
  /**
   * Log a typed event to PostHog
   */
  static capture<T extends PostHogEvent>(event: T, props?: EventPropsMap[T]) {
    try {
      posthogClient.capture(event, props ?? {});
    } catch (error) {
      console.error("[PostHog] Failed to capture event:", event, error);
    }
  }

  /**
   * Identify the current user for PostHog tracking
   */
  static identify(userId: string, traits?: Record<string, any>) {
    try {
      posthogClient.identify(userId, traits);
    } catch (error) {
      console.error("[PostHog] Failed to identify user:", error);
    }
  }

  /**
   * Reset PostHog state (logout)
   */
  static reset() {
    try {
      posthogClient.reset();
    } catch (error) {
      console.error("[PostHog] Failed to reset PostHog:", error);
    }
  }

  /**
   * Track an async flow (auto logs success/failure)
   */
  static async trackAsync<T extends PostHogEvent>(
    event: T,
    fn: () => Promise<unknown>,
    props?: EventPropsMap[T]
  ) {
    try {
      this.capture(event, props);
      const result = await fn();
      this.capture(`${event}_success` as PostHogEvent, props);
      return result;
    } catch (error: any) {
      this.capture(
        `${event}_failed` as PostHogEvent,
        {
          ...(props || {}),
          error: error.message,
        } as EventPropsMap[T]
      );
      throw error;
    }
  }
}
