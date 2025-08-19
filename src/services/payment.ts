// services/payment.ts
import api from "./api";
import { getToken } from "./auth";

interface InitializeDepositPayload {
  amount: number;
  account_type: string;
  goal_id?: string | null;
}

interface InitializeDepositResponse {
  authorization_url: string;
  reference: string;
  message: string;
}

interface VerifyDepositResponse {
  message: string;
  amount: number;
  account_type: string;
  reference: string;
  success: boolean;
}

export const initializeDeposit = async (
  amount: number,
  accountType: string,
  goalId?: string | null
): Promise<InitializeDepositResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Validate inputs
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount. Amount must be greater than 0");
    }

    if (!accountType || typeof accountType !== "string") {
      throw new Error("Invalid account type");
    }

    // Prepare the payload
    const payload: InitializeDepositPayload = {
      amount: parseFloat(amount.toString()),
      account_type: accountType.toLowerCase().trim(),
      goal_id: goalId && goalId.trim() !== "" ? goalId.trim() : null,
    };

    console.log("🔄 Initializing deposit with payload:", payload);

    const response = await api.post<InitializeDepositResponse>(
      "/payments/init-deposit",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Deposit initialization successful:", response.data);

    if (!response.data?.authorization_url) {
      throw new Error("Backend did not return authorization URL");
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ Error initializing deposit:", {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    }
    
    if (error.response?.status === 400) {
      const errorDetail = error.response?.data?.detail;
      if (typeof errorDetail === "string") {
        throw new Error(errorDetail);
      } else if (Array.isArray(errorDetail)) {
        const validationErrors = errorDetail
          .map((err: any) => `${err.loc?.join(".")} - ${err.msg}`)
          .join(", ");
        throw new Error(`Validation errors: ${validationErrors}`);
      }
    }

    throw error;
  }
};

export const verifyDeposit = async (
  reference: string
): Promise<VerifyDepositResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    if (!reference || typeof reference !== "string") {
      throw new Error("Invalid payment reference");
    }

    console.log("🔄 Verifying deposit with reference:", reference);

    const response = await api.get<VerifyDepositResponse>(
      "/payments/verify-deposit",
      {
        params: { reference: reference.trim() },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Deposit verification successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error verifying deposit:", {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error("Transaction not found or was cancelled");
    }
    
    if (error.response?.status === 400) {
      const errorDetail = error.response?.data?.detail;
      throw new Error(errorDetail || "Payment verification failed");
    }

    throw error;
  }
};