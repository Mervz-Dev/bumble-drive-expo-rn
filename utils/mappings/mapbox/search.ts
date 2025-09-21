import { RetrieveSearch, SuggestedSearch } from "@/types/app/search";
import { RetrieveResponse, SuggestResponse } from "@/types/mapbox/search";

export const normaliseSearchSuggest = (
  data: SuggestResponse
): SuggestedSearch[] => {
  return data.suggestions.map((prop) => {
    return {
      name: prop.name,
      fullAddress: prop.full_address || "",
      mapBoxId: prop.mapbox_id,
      distance: prop.distance || "",
    };
  });
};

export const normaliseSearchRetrieve = (
  data: RetrieveResponse
): RetrieveSearch => {
  const prop = data.features?.[0].properties;
  return {
    name: prop.name,
    fullAddress: prop.full_address || "",
    mapBoxId: prop.mapbox_id,
    coordinates: prop.coordinates,
    bbox: prop.bbox,
  };
};
