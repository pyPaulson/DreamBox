import api from "./api";

export const initializeDeposit = async (amount, accountType, goalId = null) => {
  try {
    // Prepare the query parameters (your backend expects query params, not JSON body)
    const params = {
      amount: parseFloat(amount),
      account_type: accountType.toLowerCase(),
    };

    // Only add goal_id if it exists and is not empty
    if (
      goalId &&
      goalId.trim() !== "" &&
      goalId !== "null" &&
      goalId !== "undefined"
    ) {
      params.goal_id = goalId.trim();
    }

    console.log("🔄 Sending query params to backend:", params);

    // Send as query parameters (matching your original backend expectation)
    const response = await api.post("/payments/init-deposit", null, { params });

    console.log("✅ Backend response:", response.data);

    if (!response.data || !response.data.authorization_url) {
      throw new Error(
        "Backend did not return expected data (authorization_url is missing)"
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error initializing deposit:", {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    throw error;
  }
};

export const verifyDeposit = async (reference) => {
  try {
    console.log("🔄 Verifying deposit with reference:", reference);

    const response = await api.get(`/payments/verify-deposit`, {
      params: { reference },
    });

    console.log("✅ Verification response:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Error verifying deposit:", {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    throw error;
  }
};
