import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const onStartPress = () => {
    router.push("/login");
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#FACC15", "#ffffff"]}
        style={{
          height: height * 0.33,
          justifyContent: "center",
          alignItems: "center",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Text className="text-5xl font-extrabold tracking-tight text-black pt-6">
          🐝 Bumble
          <Text className="text-black"> Drive</Text>
        </Text>
        <Text className="text-black/70 mt-2 italic text-base">
          Bzzz… zip to your ride in seconds.
        </Text>
      </LinearGradient>

      <View className="flex-1 pt-10 gap-12">
        <View className="justify-center items-center">
          <Image
            source={require("@/assets/illustration/car-illustration.jpg")}
            style={{
              width: width * 0.75,
              height: width * 0.5,
              resizeMode: "contain",
            }}
          />
        </View>

        <View className="mb-20 items-center">
          <TouchableOpacity
            onPress={onStartPress}
            className="bg-black px-14 py-5 rounded-full shadow-lg active:scale-95"
            activeOpacity={0.85}
          >
            <Text className="text-lg font-bold text-yellow-400 tracking-wide">
              {"Get Started"}
            </Text>
          </TouchableOpacity>

          <Text className="mt-5 text-sm text-gray-600">
            Already have an account? Tap to log in or sign up.
          </Text>
        </View>
      </View>

      <View className={`items-center mb-6 py-4 border-t border-gray-200`}>
        <View className="flex-row gap-6 mb-2">
          <TouchableOpacity
            onPress={() => Linking.openURL("https://facebook.com")}
          >
            <Ionicons name="logo-facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://twitter.com")}
          >
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://instagram.com")}
          >
            <Ionicons name="logo-instagram" size={24} color="#C13584" />
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-400">
          © 2025 Bumble Drive. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

export default Home;
