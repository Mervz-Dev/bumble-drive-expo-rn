const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  mapbox: {
    apiUrl: process.env.EXPO_PUBLIC_MAPBOX_API_BASE_URL,
    accessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
};

export default config;
