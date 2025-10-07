import config from "@/config";
import axios from "axios";

const supabaseFunctions = axios.create({
  baseURL: `${config.supabase.url}/functions/v1/`,
});

supabaseFunctions.interceptors.request.use(
  (axiosConfig) => {
    axiosConfig.headers.Authorization = `Bearer ${config.supabase.anonKey}`;

    console.log(
      `[Request] ${axiosConfig.method?.toUpperCase()} ${axiosConfig.url}`,
      axiosConfig.params || axiosConfig.data
    );

    return axiosConfig;
  },
  (error) => {
    console.error(error);
    // Sentry.captureException(error);
    return Promise.reject(error);
  }
);

supabaseFunctions.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status >= 500) {
      //   Sentry.captureException(error);
      console.error(error);
    }
    return Promise.reject(error);
  }
);

export default supabaseFunctions;
