import axios from "axios";

// Using Vite's environment variables or defaulting to local endpoint
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    // Add standard timeouts or other configs here if needed
    timeout: 10000,
});

// Optional: Add interceptors for handling auth tokens or global errors
api.interceptors.request.use(
    (config) => {
        // e.g., const token = useAuthStore.getState().token;
        // if (token) config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors, e.g., 401 Unauthorized redirect
        // Use toast/sonner for global error notifications
        return Promise.reject(error);
    }
);
