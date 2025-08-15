import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import FormButton from "./FormButton";
import { initializeDeposit, verifyDeposit } from "@/services/payment";

const NETWORKS = ["MTN", "Tel", "AT"];

const DepositModal = ({
  visible,
  onClose,
  goalId,
  goalType,
  onDepositSuccess, // Add this prop to handle successful deposits
}: {
  visible: boolean;
  onClose: () => void;
  goalId: string | null;
  goalType: string;
  onDepositSuccess?: (amount: number) => void;
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectNetwork = (network: string) => {
    setSelectedNetwork(network);
    setShowDropdown(false);
  };

  const resetForm = () => {
    setAmount("");
    setMobileNumber("");
    setSelectedNetwork("MTN");
    setIsProcessing(false);
  };

  const handleDeposit = async () => {
    if (!mobileNumber || !amount) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    try {
      setIsProcessing(true);

      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        Alert.alert("Invalid Amount", "Please enter a valid amount.");
        return;
      }

      // Clean goalId - remove any file extensions that might have been added
      const cleanGoalId = goalId?.replace(/\.(tsx?|jsx?)$/, "") || null;

      console.log("Initializing deposit with:", {
        amount: amountNumber,
        accountType: goalType,
        goalId: cleanGoalId,
      });

      // Step 1: Initialize payment with Paystack
      const { authorization_url, reference } = await initializeDeposit(
        amountNumber,
        goalType,
        cleanGoalId
      );

      console.log("Payment initialized successfully:", {
        authorization_url,
        reference,
      });

      // Step 2: Open Paystack payment page
      const result = await WebBrowser.openBrowserAsync(authorization_url);

      console.log("Browser result:", result);

      // Step 3: Always attempt to verify payment after browser closes
      // This handles both successful payments and cancelled ones
      try {
        console.log("Verifying payment with reference:", reference);

        // Add a small delay to allow payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const verification = await verifyDeposit(reference);
        console.log("Payment verification result:", verification);

        if (
          verification.success &&
          verification.message?.includes("successfully")
        ) {
          Alert.alert(
            "Payment Successful! 🎉",
            `Your deposit of GHS ${amountNumber} has been added successfully.`,
            [
              {
                text: "OK",
                onPress: () => {
                  resetForm();

                  // Call the success callback to update parent component
                  if (onDepositSuccess) {
                    onDepositSuccess(amountNumber);
                  }

                  onClose();
                },
              },
            ]
          );
        } else {
          // Payment not successful or still pending
          Alert.alert(
            "Payment Status",
            verification.message ||
              "Payment verification completed. Please check your account balance."
          );
        }
      } catch (verifyError: any) {
        console.error("Verification error:", verifyError);

        // If verification fails, it might be because payment is still processing
        Alert.alert(
          "Payment Verification",
          "Unable to verify payment status immediately. Please check your account balance in a few minutes.",
          [
            {
              text: "OK",
              onPress: () => {
                resetForm();
                onClose();
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Deposit error:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));

      let errorMessage = "An error occurred during payment.";
      if (error?.response?.data?.detail) {
        // Handle FastAPI validation errors (which are arrays)
        if (Array.isArray(error.response.data.detail)) {
          const validationErrors = error.response.data.detail
            .map((err: any) => `${err.loc?.join(".")} - ${err.msg}`)
            .join("\n");
          errorMessage = `Validation Error:\n${validationErrors}`;
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>Pay With Mobile Money</Text>

              <Text style={styles.label}>Select Network Provider</Text>

              {/* Dropdown */}
              <Pressable
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
                disabled={isProcessing}
              >
                <Text style={styles.dropdownText}>
                  {selectedNetwork} Mobile Money
                </Text>
                <Ionicons name="chevron-down" size={20} color="#888" />
              </Pressable>

              {showDropdown && (
                <View style={styles.dropdownList}>
                  {NETWORKS.map((network) => (
                    <Pressable
                      key={network}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectNetwork(network)}
                    >
                      <Text style={styles.dropdownItemText}>
                        {network} Mobile Money
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Network buttons */}
              <View style={styles.networkOptions}>
                {NETWORKS.map((network) => (
                  <TouchableOpacity
                    key={network}
                    onPress={() => setSelectedNetwork(network)}
                    style={[
                      styles.networkBtn,
                      selectedNetwork === network && styles.networkBtnSelected,
                    ]}
                    disabled={isProcessing}
                  >
                    <Text
                      style={[
                        styles.networkBtnText,
                        selectedNetwork === network &&
                          styles.networkBtnTextSelected,
                      ]}
                    >
                      {network}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mobile Number Input */}
              <Text style={styles.label}>Enter Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixWrapper}>
                  <Text style={styles.prefixText}>+233</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  editable={!isProcessing}
                />
              </View>

              {/* Amount Input */}
              <Text style={styles.label}>Enter Payment Amount</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixWrapper}>
                  <Text style={styles.prefixText}>GHS</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!isProcessing}
                />
              </View>

              {/* Pay Now Button */}
              <FormButton
                title={isProcessing ? "Processing..." : "Pay Now"}
                onPress={handleDeposit}
                disabled={isProcessing}
              />

              <Pressable
                onPress={handleClose}
                style={[styles.cancelBtn, isProcessing && styles.disabledBtn]}
                disabled={isProcessing}
              >
                <Text
                  style={[
                    styles.cancelText,
                    isProcessing && styles.disabledText,
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DepositModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.title,
    textAlign: "center",
    marginBottom: 20,
    color: AppColors.primary,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: AppColors.primary,
    marginTop: 10,
    marginBottom: 7,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: AppColors.grey_two,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: AppColors.background_one,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
  },
  dropdownList: {
    backgroundColor: AppColors.background_one,
    borderWidth: 0.3,
    borderColor: AppColors.grey_two,
    borderRadius: 7,
    marginTop: 5,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownItemText: {
    fontFamily: Fonts.body,
    color: "#333",
  },
  networkOptions: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 12,
  },
  networkBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  networkBtnSelected: {
    backgroundColor: AppColors.primary,
  },
  networkBtnText: {
    fontFamily: Fonts.body,
    color: "#333",
  },
  networkBtnTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
    height: 55,
    overflow: "hidden",
  },
  prefixWrapper: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    height: "100%",
  },
  prefixText: {
    fontFamily: Fonts.body,
    color: "#333",
    fontSize: 14,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: Fonts.body,
    fontSize: 15,
    height: "100%",
  },
  cancelBtn: {
    alignItems: "center",
    marginTop: 20,
  },
  cancelText: {
    color: AppColors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
