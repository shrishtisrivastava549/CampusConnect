import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://campusconnect-backend-0ms4.onrender.com/api"
).replace(/\/$/, "");

export const BACKEND_URL = API_BASE_URL.replace(/\/api$/i, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export default api;
