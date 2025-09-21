import { supabase } from "@/services/supabase";
import MapboxGL from "@rnmapbox/maps";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

const TOKEN =
  "pk.eyJ1IjoibWVydnpzLWRldiIsImEiOiJjbWZsMTBsbGowMDRlMmtwdjBmNXFibXgwIn0.ft1jYzEsIm5lIovtq_smlA";

MapboxGL.setAccessToken(TOKEN);

const Home = () => {
  const onStartPress = () => {
    if (session && session.user) {
      router.push({
        pathname: "/search-destination",
      });
    } else {
      router.push({
        pathname: "/(public)/login",
      });
    }
  };

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View className="flex-1">
      <MapboxGL.MapView
        scaleBarEnabled={false}
        logoEnabled={false}
        projection="mercator"
        style={{ width, height, opacity: 0.5 }}
        styleURL={MapboxGL.StyleURL.Street}
      >
        <MapboxGL.Camera
          animationDuration={3000}
          zoomLevel={12}
          centerCoordinate={[120.9842, 14.5995]}
        />
      </MapboxGL.MapView>

      <View className="absolute inset-0 bg-black/1" />

      <View className="absolute inset-0 px-6">
        <View className="mt-20 items-center">
          <Text
            className="text-4xl font-extrabold tracking-tight text-white"
            style={{
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 4,
            }}
          >
            🐝 <Text className="text-yellow-400">Bumble</Text>
            <Text className="text-black"> Drive</Text>
          </Text>
        </View>

        <View className="flex-1 justify-center items-center">
          <TouchableOpacity
            onPress={onStartPress}
            className="bg-yellow-500 px-10 py-5 rounded-3xl shadow-xl active:scale-95"
            activeOpacity={0.8}
          >
            <Text className="text-lg font-bold text-black tracking-wide">
              Drive you where?
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-14 items-center">
          <View className="bg-white/90 px-6 py-3 rounded-full shadow-sm">
            <Text className="text-gray-700 text-sm italic">
              Your journey, just a tap away.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
