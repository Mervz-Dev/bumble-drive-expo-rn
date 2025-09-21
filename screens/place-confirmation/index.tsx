import { RetrieveSearch } from "@/types/app/search";
import { RootStackParamList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import MapboxGL from "@rnmapbox/maps";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

const TOKEN =
  "pk.eyJ1IjoibWVydnpzLWRldiIsImEiOiJjbWZsMTBsbGowMDRlMmtwdjBmNXFibXgwIn0.ft1jYzEsIm5lIovtq_smlA";

MapboxGL.setAccessToken(TOKEN);

const PlaceConfirmation = () => {
  const params =
    useLocalSearchParams<RootStackParamList["place-confirmation"]>();

  const place = params.place
    ? (JSON.parse(params.place as string) as RetrieveSearch)
    : undefined;

  const center = place
    ? [place.coordinates.longitude, place.coordinates.latitude]
    : [120.9842, 14.5995];

  const handleConfirm = () => {
    router.push({
      pathname: "/trip-preview",
      params: {
        placeDestination: JSON.stringify(place),
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <MapboxGL.MapView
        scaleBarEnabled={false}
        logoEnabled={false}
        projection="mercator"
        style={{ width, height }}
        styleURL={MapboxGL.StyleURL.Street}
      >
        <MapboxGL.Camera
          centerCoordinate={center}
          zoomLevel={15}
          animationMode="flyTo"
          animationDuration={800}
          followUserLocation={false}
        />

        {place && (
          <MapboxGL.PointAnnotation id="selected-place" coordinate={center}>
            <Ionicons name="location-sharp" size={50} color="#E53935" />
          </MapboxGL.PointAnnotation>
        )}
      </MapboxGL.MapView>

      {place && (
        <View className="absolute top-16 left-4 right-4 flex-row items-center bg-white/95 rounded-xl px-3 py-2 shadow-md">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white rounded-full p-2 mr-3 shadow-sm"
          >
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className="text-base font-bold text-gray-900"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {place.name}
            </Text>
            {place.fullAddress && (
              <Text
                className="text-xs text-gray-600"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {place.fullAddress}
              </Text>
            )}
          </View>
        </View>
      )}

      <View className="absolute bottom-8 w-full px-6">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleConfirm}
          className="bg-black rounded-full py-4 shadow-lg"
        >
          <Text className="text-center text-white font-bold text-lg">
            Confirm Destination
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlaceConfirmation;
