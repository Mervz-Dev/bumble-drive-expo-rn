import { RetrieveSearch, SuggestedSearch } from "@/types/app/search";
import { RetrieveResponse, SuggestResponse } from "@/types/mapbox/search";
import {
  normaliseSearchRetrieve,
  normaliseSearchSuggest,
} from "@/utils/mappings/mapbox/search";
import { AxiosResponse } from "axios";
import * as Crypto from "expo-crypto";
import MapboxApi from "./index";

const uuid = Crypto.randomUUID();

const SEARCH = "/search/searchbox/v1";

interface SearchPlacesParams {
  proximity?: string;
  country?: string;
  types?: string;
}

export const searchPlaces = async (
  query: string,
  params?: SearchPlacesParams
): Promise<SuggestedSearch[]> => {
  try {
    const response: AxiosResponse = await MapboxApi.get(`${SEARCH}/suggest`, {
      params: {
        q: query,
        session_token: uuid,
        ...params,
      },
    });

    // TODO: update this response update

    if (response.status === 404) {
      return [];
    }

    return normaliseSearchSuggest(response.data as SuggestResponse);
  } catch (error) {
    console.log("searchPlaces error: ", error);
    return [];
  }
};

export const getRetrievePlaces = async (
  id: string
): Promise<RetrieveSearch | null> => {
  try {
    const response: AxiosResponse = await MapboxApi.get(
      `${SEARCH}/retrieve/${id}`,
      {
        params: {
          session_token: uuid,
        },
      }
    );

    // TODO: update this response update

    if (response.status === 404) {
      return null;
    }

    return normaliseSearchRetrieve(response.data as RetrieveResponse);
  } catch (error) {
    console.log("getRetrievePlaces error: ", error);
    return null;
  }
};
