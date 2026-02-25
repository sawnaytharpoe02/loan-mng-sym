import axios from "axios";

// Using Vite's environment variables or defaulting to local endpoint
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Inject Bearer token on every request
api.interceptors.request.use(
    (config) => {
        try {
            const authStorage = localStorage.getItem("auth-storage");
            if (authStorage) {
                const token = JSON.parse(authStorage)?.state?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error("Error parsing auth-storage", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Redirect to login on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth-storage");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
