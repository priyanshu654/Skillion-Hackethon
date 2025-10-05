import axios from "axios";

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Add timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if stored in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    // If token is stored as string, use directly
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    
    if (error.code === "ECONNREFUSED") {
      console.error("Backend server is not running or not reachable");
    } else if (error.response) {
      // Server responded with error status
      console.error("Server Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;