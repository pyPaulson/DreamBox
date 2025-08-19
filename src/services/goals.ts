// services/goals.ts
import api from "./api";
import { getToken } from "./auth";

// Type definitions
interface SafeLockGoal {
  id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  emergency_fund_percentage?: number;
  has_emergency_fund: boolean;
  created_at: string;
}

interface MyGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  created_at: string;
}

interface EmergencyFund {
  id: string;
  user_id: string;
  balance: number;
}

interface FlexiAccount {
  id: string;
  user_id: string;
  balance: number;
}

interface SafeLockCreatePayload {
  goal_name: string;
  target_amount: number;
  target_date: string;
  has_emergency_fund: boolean;
  emergency_fund_percentage?: number;
  agree_to_lock: boolean;
}

interface MyGoalCreatePayload {
  goal_name: string;
  target_amount: number;
  target_date: string;
}

// SafeLock Goals
export const createSafeLock = async (goalData: {
  goal_name: string;
  target_amount: number;
  target_date: string;
  has_emergency_fund: boolean;
  emergency_fund_percentage?: number;
  agree_to_lock: boolean;
}): Promise<SafeLockGoal> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    console.log("Creating SafeLock with data:", goalData);

    const response = await api.post<SafeLockGoal>("/goals/create", goalData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("SafeLock created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating SafeLock:", error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      const errorDetail = error.response?.data?.detail;
      if (Array.isArray(errorDetail)) {
        const validationErrors = errorDetail
          .map((err: any) => `${err.loc?.join(".")} - ${err.msg}`)
          .join(", ");
        throw new Error(`Validation errors: ${validationErrors}`);
      } else if (typeof errorDetail === "string") {
        throw new Error(errorDetail);
      }
    }
    
    throw error;
  }
};

export const fetchSafeLocks = async (): Promise<SafeLockGoal[]> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get<SafeLockGoal[]>("/goals/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("SafeLocks fetched successfully:", response.data?.length || 0, "goals");
    return response.data || [];
  } catch (error: any) {
    console.error("Error fetching SafeLocks:", error.response?.data || error.message);
    throw error;
  }
};

// MyGoals
export const getMyGoals = async (): Promise<MyGoal[]> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get<MyGoal[]>("/goals/my-Goals", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("MyGoals fetched successfully:", response.data?.length || 0, "goals");
    return response.data || [];
  } catch (error: any) {
    console.error("Error getting MyGoals:", error.response?.data || error.message);
    throw error;
  }
};

export const createMyGoal = async (data: MyGoalCreatePayload): Promise<MyGoal> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    console.log("Creating MyGoal with data:", data);

    const response = await api.post<MyGoal>("/goals/create-myGoal", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("MyGoal created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating MyGoal:", error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      const errorDetail = error.response?.data?.detail;
      if (Array.isArray(errorDetail)) {
        const validationErrors = errorDetail
          .map((err: any) => `${err.loc?.join(".")} - ${err.msg}`)
          .join(", ");
        throw new Error(`Validation errors: ${validationErrors}`);
      } else if (typeof errorDetail === "string") {
        throw new Error(errorDetail);
      }
    }
    
    throw error;
  }
};

// Emergency Fund
export const getEmergencyFund = async (): Promise<EmergencyFund> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get<EmergencyFund>("/goals/emergency", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Emergency fund fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error getting emergency fund:", error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error("Emergency fund not found. Create a SafeLock with emergency fund enabled first.");
    }
    
    throw error;
  }
};

// Flexi Account
export const getFlexiAccount = async (): Promise<FlexiAccount> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.get<FlexiAccount>("/goals/flexi", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Flexi account fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error getting flexi account:", error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error("Flexi account not found");
    }
    
    throw error;
  }
};

export const createFlexiAccount = async (): Promise<FlexiAccount> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await api.post<FlexiAccount>(
      "/goals/create-flexi",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Flexi account created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating flexi account:", error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      const errorDetail = error.response?.data?.detail;
      if (typeof errorDetail === "string" && errorDetail.includes("already exists")) {
        throw new Error("Flexi account already exists");
      }
    }
    
    throw error;
  }
};