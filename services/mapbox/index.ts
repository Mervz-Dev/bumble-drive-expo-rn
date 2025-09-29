import config from "@/config";
import axios from "axios";

const mapboxApi = axios.create({
  baseURL: config.mapbox.apiUrl,
  params: {
    access_token: config.mapbox.accessToken,
  },
});

export default mapboxApi;
