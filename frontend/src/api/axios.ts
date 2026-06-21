import axios from "axios";
import { storage } from "../utils/storage";

//const API_BASE = import.meta.env.VITE_API_BASE;
const API_BASE = "http://localhost:5000/api"; 

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ Request interceptor (attach token automatically)
apiClient.interceptors.request.use((config) => {
  //const token = localStorage.getItem("auth_token");
  const token = storage.getToken(); // Use storage utility

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Response interceptor (handle global errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
