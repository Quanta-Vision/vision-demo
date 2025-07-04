// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001/v2",
});

api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("x-api-key");
  if (apiKey) config.headers["x-api-key"] = apiKey;
  return config;
});

export default api;
