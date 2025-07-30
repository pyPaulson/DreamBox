import api from "./api";
import { getToken } from "./auth";

export const getCurrentUser = async () => {
  const token = await getToken();
  if (!token) throw new Error("No token found");

  const response = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
