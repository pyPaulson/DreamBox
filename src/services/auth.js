// services/auth.js
import api from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);

  return response.data;
};
