import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/verify-2fa") {
        window.location.href = "/login";
      }
    }

    const apiError = error.response?.data;
    if (apiError && apiError.message) {
      return Promise.reject(new Error(apiError.message));
    }

    return Promise.reject(new Error(error.message));
  },
);

export default axiosClient;
