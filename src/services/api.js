import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://10.11.24.97:8001"; 

export const PAYSTACK_PUBLIC_KEY = "pk_test_58d8976eef9d54efbd37eddb89e469be16543813";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("user_token");
  console.log("🚀 SecureStore token fetched:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("⚠️ No token found in SecureStore");
  }
  return config;
});


export default api;
