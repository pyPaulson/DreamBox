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

export const verifyEmail = async ({ email, code }) => {
  const response = await api.post("/verify-email", { email, code });
  return response.data;
};

export const resendCode = async (email) => {
  const response = await api.post("/resend-code", { email });
  return response.data;
};
