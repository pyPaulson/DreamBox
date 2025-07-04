// services/user.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCurrentUser = async () => {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("No token found");

  const response = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
