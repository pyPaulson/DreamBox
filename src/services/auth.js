// services/auth.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);

  const firstName = response.data.first_name;
  if (firstName) {
    await AsyncStorage.setItem("user_first_name", firstName); 
  }

  return response.data;
};

export const sendVerificationCode = async (email) => {
  const response = await api.post("/send-verification-code", { email });
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

export const setUserPin = async (email, pin) => {
  const response = await api.post("/set-pin", { email, pin });
  return response.data;
};


export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);

  const firstName = response.data.first_name;
  if (firstName) {
    await AsyncStorage.setItem("user_first_name", firstName); 
  }

  return response.data;
};
