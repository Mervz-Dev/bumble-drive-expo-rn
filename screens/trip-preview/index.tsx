import { RetrieveSearch } from "@/types/app/search";
import { RootStackParamList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
} from "@rnmapbox/maps";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const TOKEN =
  "pk.eyJ1IjoibWVydnpzLWRldiIsImEiOiJjbWZsMTBsbGowMDRlMmtwdjBmNXFibXgwIn0.ft1jYzEsIm5lIovtq_smlA";

Mapbox.setAccessToken(TOKEN);

export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const cameraRef = useRef<Camera>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const params = useLocalSearchParams<RootStackParamList["trip-preview"]>();
  const destinationPlace: RetrieveSearch | undefined = params.placeDestination
    ? (JSON.parse(params.placeDestination) as RetrieveSearch)
    : undefined;

  const [pickUp, setPickUp] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [sheetIndex, setSheetIndex] = useState<number>(-1);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted")
        return console.warn("Location permission denied");

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setPickUp([coords.longitude, coords.latitude]);
    })();
  }, []);

  const computeRoute = async () => {
    if (!pickUp || !destinationPlace) return;

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickUp[0]},${pickUp[1]};${destinationPlace.coordinates.longitude},${destinationPlace.coordinates.latitude}?geometries=geojson&access_token=${TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();
      const geometry = data.routes[0].geometry;
      setRoute({ type: "Feature", geometry });

      // Fit map bounds to show both points
      const lons = [pickUp[0], destinationPlace.coordinates.longitude];
      const lats = [pickUp[1], destinationPlace.coordinates.latitude];
      const ne: [number, number] = [Math.max(...lons), Math.max(...lats)];
      const sw: [number, number] = [Math.min(...lons), Math.min(...lats)];
      cameraRef.current?.fitBounds(ne, sw, 150, 800);

      // Sample drivers
      setDrivers([
        { id: "1", name: "Driver A", car: "Toyota Prius" },
        { id: "2", name: "Driver B", car: "Honda Civic" },
        { id: "3", name: "Driver C", car: "Ford Ranger" },
      ]);

      // Open bottom sheet
      setSheetIndex(0);
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  const renderDriver = ({ item }: { item: any }) => (
    <View className="flex-row justify-between items-center py-3 px-4 border-b border-gray-200">
      <Text className="text-lg font-semibold">{item.name}</Text>
      <Text className="text-gray-500">{item.car}</Text>
    </View>
  );

  return (
    <View className="flex-1">
      <MapView
        style={{ width, height }}
        scaleBarEnabled={false}
        logoEnabled={false}
        projection="mercator"
        styleURL={Mapbox.StyleURL.Street}
      >
        <Camera
          ref={cameraRef}
          centerCoordinate={pickUp ?? [121.0549925, 14.376344249999999]}
          zoomLevel={15}
          animationMode="flyTo"
          animationDuration={800}
        />

        {/* Route */}
        {route && (
          <ShapeSource id="routeSource" shape={route}>
            <LineLayer
              id="routeLine"
              style={{
                lineColor: "#1EC58E", // visible yellow
                lineWidth: 4,
                lineJoin: "round",
              }}
            />
          </ShapeSource>
        )}

        {/* Pick-up Marker */}
        {pickUp && (
          <PointAnnotation
            id="pickUp"
            coordinate={pickUp}
            anchor={{ x: 0.5, y: 1 }}
          >
            <Ionicons name="location-sharp" size={40} color="#1E88E5" />
          </PointAnnotation>
        )}

        {/* Start circle */}
        {pickUp && route && (
          <PointAnnotation id="routeStart" coordinate={pickUp}>
            <View className="w-2 h-2 bg-[#1E88E5] rounded-full" />
          </PointAnnotation>
        )}

        {/* Destination Marker */}
        {route && destinationPlace && (
          <PointAnnotation
            id="destination"
            coordinate={[
              destinationPlace.coordinates.longitude,
              destinationPlace.coordinates.latitude,
            ]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <Ionicons name="location-sharp" size={40} color="#E53935" />
          </PointAnnotation>
        )}

        {/* End circle */}
        {route && route.geometry.coordinates.length > 0 && (
          <PointAnnotation
            id="routeEnd"
            coordinate={
              route.geometry.coordinates[route.geometry.coordinates.length - 1]
            }
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View className="w-2 h-2 bg-[#E53935] rounded-full" />
          </PointAnnotation>
        )}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-4 bg-white rounded-full p-2 shadow-sm"
      >
        <Ionicons name="arrow-back" size={20} color="#111827" />
      </TouchableOpacity>

      {/* Confirm Pick-Up */}
      {pickUp && !route && (
        <View className="absolute bottom-8 w-full px-6">
          <TouchableOpacity
            className="bg-black rounded-full py-4 shadow-lg"
            activeOpacity={0.8}
            onPress={computeRoute}
          >
            <Text className="text-white font-bold text-center text-lg">
              Confirm Pick-Up Location
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndex}
        snapPoints={["40%", "70%"]}
        enablePanDownToClose
        onChange={(idx) => setSheetIndex(idx)}
      >
        <BottomSheetView className="flex-1 px-4 pb-10">
          <Text className="text-lg font-bold mb-4">Available Drivers</Text>

          <Pressable className="flex-row justify-between items-center pt-3 px-4">
            {/* Profile Image */}
            <View className="mr-3">
              {/* <Image
                source={}
                className="w-14 h-14 rounded-full"
                resizeMode="cover"
              /> */}
            </View>

            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Mervin Narvaez
              </Text>
              <Text className="text-sm text-gray-500 mt-1">Kalesa</Text>
            </View>
          </Pressable>

          <View className="flex-row justify-between items-center py-3 px-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">
              Location: Everywhere / right beside you
            </Text>
          </View>
          {/* <FlatList
            data={drivers}
            keyExtractor={(item) => item.id}
            renderItem={renderDriver}
          /> */}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
