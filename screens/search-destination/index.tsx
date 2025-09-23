import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getRetrievePlaces, searchPlaces } from "@/services/mapbox/search";
import { SuggestedSearch } from "@/types/app/search";

import { useAuthStore } from "@/stores/authStore";
import { Ionicons } from "@expo/vector-icons";

const SearchDestination = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SuggestedSearch[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      const suggestions = await searchPlaces(text, {
        country: "ph",
        types: "poi",
      });
      setResults(suggestions);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleItemPress = async (item: SuggestedSearch) => {
    const res = await getRetrievePlaces(item.mapBoxId);
    router.push({
      pathname: "/private/place-confirmation",
      params: { type: "destination", place: res ? JSON.stringify(res) : "" },
    });
    // navigate to maps with coordinates
    // console.log(res, "response");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 px-4">
            {/* Header with Back Button */}

            <TouchableOpacity
              onPress={async () => {
                await logout();
              }}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 shadow-sm mt-2"
            >
              <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>

            {/* Title */}
            <View className="mt-4 mb-5 items-center">
              <Text className="text-2xl font-extrabold text-gray-900">
                🚕 Where are we heading?
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Search for a destination to start your ride
              </Text>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-gray-100 rounded-full shadow-sm px-4 py-3">
              <TextInput
                value={query}
                onChangeText={handleSearch}
                placeholder="Where to?"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-base text-gray-800 "
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setResults([]);
                    setQuery("");
                  }}
                  className="ml-2 px-2"
                >
                  <Text className="text-gray-500 text-sm">Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Results */}
            <View className="mt-4 bg-white rounded-2xl shadow-md max-h-96 overflow-hidden">
              <FlatList
                data={results}
                keyExtractor={(item) => item.mapBoxId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="px-4 py-3 active:bg-gray-100"
                    onPress={() => handleItemPress(item)}
                  >
                    <Text className="text-gray-900 font-semibold">
                      {item.name}
                    </Text>
                    {item.fullAddress && (
                      <Text className="text-gray-500 text-sm mt-0.5">
                        {item.fullAddress}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View className="h-96 items-center justify-center">
                    <Text className="text-gray-400 text-base">
                      🔍 Start typing to see suggestions
                    </Text>
                  </View>
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SearchDestination;
