import axios from "axios";

const API_BASE_URL = "http://172.20.10.4:8000";  

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
