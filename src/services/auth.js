// services/auth.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_token";

export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const clearAllUserData = async () => {
  try {
    await SecureStore.deleteItemAsync("user_token");
    await AsyncStorage.removeItem("user_first_name");
    await AsyncStorage.removeItem("accessToken");
    console.log("All user data cleared");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);

    const token = response.data.access_token;
    const firstName = response.data.first_name;

    if (token) {
      await saveToken(token);
      await AsyncStorage.setItem("accessToken", token);
    }

    if (firstName) {
      await AsyncStorage.setItem("user_first_name", firstName);
    }

    console.log("Registration successful, token saved:", !!token);

    return response.data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    throw error;
  }
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

export const loginUser = async (email, password) => {
  console.log("Sending login request:", { email, password });

  const res = await api.post("/login", {
    email,
    password,
  });
  console.log("Login successful");
  const token = res.data.access_token;
  const firstName = res.data.first_name;

  if (token) {
    await saveToken(token);
    // Also save to AsyncStorage for consistency
    await AsyncStorage.setItem("accessToken", token);
  }

  if (firstName) {
    await AsyncStorage.setItem("user_first_name", firstName);
  }

  return res.data;
};


export const logoutUser = async () => {
  try {
    const token = await getToken();

    if (token) {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed template literal
          },
        }
      );
    }

    await clearAllUserData();
    return true;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    // Still clear local data even if server logout fails
    await clearAllUserData();
    return false;
  }
};
