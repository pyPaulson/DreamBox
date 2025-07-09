import axios from "axios";

const API_BASE_URL = "http://10.11.24.69:8000";  

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
