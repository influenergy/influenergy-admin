import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT || "http://localhost:3001/v1/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"; // Redirect to login on unauthorized access
    }
    return Promise.reject(error);
  }
);
