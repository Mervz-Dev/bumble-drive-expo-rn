export type Context = {
  country?: {
    id: string;
    name: string;
    country_code: string; // ISO-3166-1 alpha-2
    country_code_alpha_3: string; // alpha-3
  };
  region?: {
    id: string;
    name: string;
    region_code: string;
    region_code_full: string;
  };
  postcode?: { id: string; name: string };
  district?: { id: string; name: string };
  place?: { id: string; name: string };
  locality?: { id: string; name: string };
  neighborhood?: { id: string; name: string };
  address?: {
    id: string;
    name: string;
    address_number?: string;
    street_name?: string;
  };
  street?: { id: string; name: string };
};

export interface BaseFeature {
  name: string;
  mapbox_id: string;
  feature_type: "category" | "place" | "brand" | "poi";
  address?: string;
  full_address?: string;
  place_formatted?: string;
  context?: Context;
  language?: string;
  maki?: string;
  poi_category?: string[];
  poi_category_ids?: string[];
  brand?: string | string[];
  brand_id?: string | string[];
  external_ids?: Record<string, string>;
  metadata?: any;
  bbox?: Bbox;
}

export interface Suggestion extends BaseFeature {
  name_preferred?: string;
  distance?: number;
  eta?: number;
}

export interface Coordinates {
  accuracy?: string;
  latitude: number;
  longitude: number;
  routable_points?: {
    name: string;
    latitude: number;
    longitude: number;
  }[];
}

export type Bbox = [number, number, number, number];

export interface SearchBoxFeatureSuggestion {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: BaseFeature & {
    coordinates: Coordinates;
  };
}

export interface RetrieveResponse {
  attribution: string;
  features: SearchBoxFeatureSuggestion[];
}

export interface SuggestResponse {
  suggestions: Suggestion[];
  attribution: string;
}
