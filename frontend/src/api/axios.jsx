import axios from "axios";

const api = axios.create({
  baseURL: "https://campusconnect-backend-0ms4.onrender.com/api",
});

export default api;

