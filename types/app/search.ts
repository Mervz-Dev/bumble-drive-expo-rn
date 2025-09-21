import { Bbox, Coordinates } from "../mapbox/search";

export interface SuggestedSearch {
  name: string;
  fullAddress: string;
  distance: string | number;
  mapBoxId: string;
}

export interface RetrieveSearch {
  name: string;
  fullAddress: string;
  mapBoxId: string;
  coordinates: Coordinates;
  bbox?: Bbox;
}
