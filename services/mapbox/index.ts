import axios from "axios";

const MAPBOX_API_BASE_URL = "https://api.mapbox.com";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibWVydnpzLWRldiIsImEiOiJjbWZsMTBsbGowMDRlMmtwdjBmNXFibXgwIn0.ft1jYzEsIm5lIovtq_smlA";

const mapboxApi = axios.create({
  baseURL: MAPBOX_API_BASE_URL,
  params: {
    access_token: MAPBOX_ACCESS_TOKEN,
  },
});

export default mapboxApi;
