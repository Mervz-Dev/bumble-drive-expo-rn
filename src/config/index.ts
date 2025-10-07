import Constants from "expo-constants";

const envConstants = Constants.expoConfig?.extra!;
const config = {
  supabase: {
    url: envConstants.supabase.url,
    anonKey: envConstants.supabase.anonKey,
  },
  mapbox: {
    apiUrl: envConstants.mapbox.apiUrl,
    accessToken: envConstants.mapbox.accessToken,
  },
  posthog: {
    apiKey: envConstants.posthog.apiKey,
    host: envConstants.posthog.host,
  },
} as const;

export default config;
