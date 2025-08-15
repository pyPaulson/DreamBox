// services/auth.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_token";

export const saveToken = async (token) => {
  try {
    // Don't save placeholder tokens
    if (!token || token === "xxx.jwt.token.here") {
      console.log("Skipping save of invalid token");
      return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await AsyncStorage.setItem("accessToken", token); // Keep both for consistency
    console.log("Token saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async () => {
  try {
    // Try SecureStore first, fallback to AsyncStorage
    let token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      token = await AsyncStorage.getItem("accessToken");
      if (token && token !== "xxx.jwt.token.here") {
        // Migrate to SecureStore
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    }

    // Don't return placeholder tokens
    if (token === "xxx.jwt.token.here") {
      console.log("Found placeholder token, treating as no token");
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const clearAllUserData = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
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

    // Save token only if it's not the placeholder
    if (token && token !== "xxx.jwt.token.here") {
      await saveToken(token);
      console.log("Valid token received and saved during registration");
    } else {
      console.log("Placeholder token received, not saving");
    }

    if (firstName) {
      await AsyncStorage.setItem("user_first_name", firstName);
    }

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
  try {
    console.log("verifyEmail - Sending:", { email, code });
    const response = await api.post("/verify-email", { email, code });
    console.log("verifyEmail - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "verifyEmail - Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const resendCode = async (email) => {
  const response = await api.post("/resend-code", { email });
  return response.data;
};

export const setUserPin = async (email, pin) => {
  try {
    console.log("setUserPin - Input params:", { email, pin });

    // Validate inputs
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email parameter");
    }

    if (!pin || typeof pin !== "string") {
      throw new Error("Invalid pin parameter");
    }

    if (!email.includes("@")) {
      throw new Error("Email format is invalid");
    }

    if (pin.length !== 4) {
      throw new Error("PIN must be 4 digits");
    }

    const requestData = {
      email: email.trim().toLowerCase(),
      pin: pin.trim(),
    };

    console.log("setUserPin - Sending request:", requestData);

    // Try without authentication first (as per your backend code)
    try {
      const response = await api.post("/set-pin", requestData);
      console.log("setUserPin - Success response:", response.data);
      return response.data;
    } catch (unauthError) {
      console.log("setUserPin - Trying with authentication...");

      // If that fails, try with token
      const token = await getToken();
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = await api.post("/set-pin", requestData, config);
        console.log("setUserPin - Success response with auth:", response.data);
        return response.data;
      } else {
        throw unauthError;
      }
    }
  } catch (error) {
    console.error("setUserPin - Full error:", error);
    console.error("setUserPin - Response data:", error.response?.data);
    console.error("setUserPin - Response status:", error.response?.status);

    // Log the exact error details
    if (error.response?.data) {
      console.error(
        "setUserPin - Server error details:",
        JSON.stringify(error.response.data, null, 2)
      );
    }

    throw error;
  }
};

export const loginUser = async (email, password) => {
  console.log("Sending login request:", { email, password: "***" });

  const res = await api.post("/login", {
    email,
    password,
  });

  console.log("Login successful");
  const token = res.data.access_token;
  const firstName = res.data.first_name;

  if (token) {
    await saveToken(token);
  }

  if (firstName) {
    await AsyncStorage.setItem("user_first_name", firstName);
  }

  return res.data;
};

export const logoutUser = async () => {
  try {
    const token = await getToken();

    // Only call server logout if we have a valid token
    if (token) {
      try {
        await api.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Server logout successful");
      } catch (serverError) {
        console.error(
          "Server logout failed:",
          serverError.response?.data || serverError.message
        );
        // Continue with local cleanup even if server logout fails
      }
    }

    await clearAllUserData();
    console.log("Local logout completed");
    return true;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    // Still clear local data even if everything fails
    await clearAllUserData();
    return false;
  }
};
