// services/goal.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createSafeLock = async (goalData, token) => {
  const res = await api.post("/goals/create", goalData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchSafeLocks = async (token) => {
  const res = await api.get("/goals/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMyGoals = async () => {
  const res = await api.get("/goals/my-Goals");
  return res.data;
};

export const createMyGoal = async (data) => {
  const res = await api.post("/goals/create-myGoal", data);
  return res.data;
};

export const getEmergencyFund = async (token) => {
  const res = await api.get("/goals/emergency", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};