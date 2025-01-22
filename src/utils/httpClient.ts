import axios from "axios";

// const ENV_API_URL = import.meta.env.VITE_API_URL;
// const ENV_API_KEY = import.meta.env.VITE_API_KEY;

export const httpClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

httpClient.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_API_KEY;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
