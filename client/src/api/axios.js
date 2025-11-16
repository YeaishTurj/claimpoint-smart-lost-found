import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // backend

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add JWT token automatically if stored
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
