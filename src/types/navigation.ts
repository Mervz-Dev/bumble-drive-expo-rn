import { NavigationProp } from "@react-navigation/native";

export type RootStackParamList = {
  index: undefined;
  "search-destination": undefined;
  "place-confirmation": {
    place: string;
  };
  "trip-preview": {
    placeDestination: string;
  };
};

export type RootNavigationProps = NavigationProp<RootStackParamList>;
