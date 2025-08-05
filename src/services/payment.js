import api from "./api"; // your configured axios instance

// Step 1: Initialize deposit
export const initializeDeposit = async (amount, accountType, goalId) => {
  try {
    const params = {
      amount: parseFloat(amount),
      account_type: accountType,
    };

    if (goalId && goalId.trim() !== "") {
      params.goal_id = goalId.trim();
    }

    console.log("Sending query params to backend:", params);

    const response = await api.post("/payments/init-deposit", null, { params });

    console.log("🔍 Full backend response:", response);

    if (!response.data || !response.data.authorization_url) {
      throw new Error(
        "Backend did not return expected data (authorization_url is missing)"
      );
    }

    return response.data;
  } catch (error) {
    console.log(
      "🚨 Error initializing deposit:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Step 2: Verify deposit (no changes needed)
export const verifyDeposit = async (reference) => {
  try {
    const response = await api.get(`/payments/verify-deposit`, {
      params: { reference },
    });
    return response.data;
  } catch (error) {
    console.log(
      "Error verifying deposit:",
      error.response?.data || error.message
    );
    throw error;
  }
};
