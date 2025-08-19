import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import FormInput from "@/components/FormInput";
import FormButton from "./FormButton";

interface SafeLockModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGoal: (goal: {
    title: string;
    amount: number;
    targetDate: string;
    emergencyFund?: number;
  }) => void;
  showEmergencyOptions?: boolean;
  showConfirmationCheckbox?: boolean;
}

const SafeLockModal: React.FC<SafeLockModalProps> = ({
  visible,
  onClose,
  onCreateGoal,
  showEmergencyOptions = false,
  showConfirmationCheckbox = false,
}) => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [hasEmergencyFund, setHasEmergencyFund] = useState<boolean>(false);
  const [emergencyPercentage, setEmergencyPercentage] = useState<string>("");
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const resetForm = (): void => {
    setTitle("");
    setAmount("");
    setTargetDate(new Date());
    setHasEmergencyFund(false);
    setEmergencyPercentage("");
    setAgreeToTerms(false);
  };

  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const validateInputs = (): { isValid: boolean; error?: string } => {
    if (!title.trim()) {
      return { isValid: false, error: "Please enter a goal title" };
    }

    if (!amount.trim()) {
      return { isValid: false, error: "Please enter target amount" };
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return {
        isValid: false,
        error: "Please enter a valid amount greater than 0",
      };
    }

    if (amountNumber < 10) {
      return { isValid: false, error: "Minimum target amount is GHS 10.00" };
    }

    // Check if target date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(targetDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { isValid: false, error: "Target date must be in the future" };
    }

    // Validate emergency fund percentage if enabled
    if (showEmergencyOptions && hasEmergencyFund) {
      if (!emergencyPercentage.trim()) {
        return {
          isValid: false,
          error: "Please enter emergency fund percentage",
        };
      }

      const percentage = parseFloat(emergencyPercentage);
      if (isNaN(percentage) || percentage <= 0 || percentage > 30) {
        return {
          isValid: false,
          error: "Emergency fund percentage must be between 1-30%",
        };
      }
    }

    // Validate agreement checkbox if required
    if (showConfirmationCheckbox && !agreeToTerms) {
      return { isValid: false, error: "Please agree to the terms to continue" };
    }

    return { isValid: true };
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };

  const handleCreateGoal = (): void => {
    const validation = validateInputs();
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.error);
      return;
    }

    try {
      const goalData = {
        title: title.trim(),
        amount: parseFloat(amount),
        targetDate: targetDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        ...(showEmergencyOptions &&
          hasEmergencyFund && {
            emergencyFund: parseFloat(emergencyPercentage),
          }),
      };

      console.log("Creating goal with data:", goalData);
      onCreateGoal(goalData);
      resetForm();
    } catch (error) {
      console.error("Error creating goal:", error);
      Alert.alert("Error", "Failed to create goal. Please try again.");
    }
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>
                {showEmergencyOptions ? "Create SafeLock Goal" : "Create Goal"}
              </Text>

              {/* Goal Title */}
              <FormInput
                label="Give your plan a name"
                placeholder="E.g Rent, Travel"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="words"
              />

              {/* Target Amount */}
              <FormInput
                label="Enter your target amount"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {/* Target Date */}
              <Pressable onPress={() => setShowDatePicker(true)}>
                <FormInput
                  label="Target Date"
                  placeholder="Select a date"
                  value={targetDate.toDateString()}
                  editable={false}
                  icon={
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={AppColors.grey}
                    />
                  }
                />
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={targetDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
                  maximumDate={
                    new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
                  } // 10 years from now
                  onChange={handleDateChange}
                />
              )}

              {/* Emergency Fund Options */}
              {showEmergencyOptions && (
                <View style={styles.emergencySection}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>
                      Enable Emergency Fund
                    </Text>
                    <Switch
                      value={hasEmergencyFund}
                      onValueChange={setHasEmergencyFund}
                      trackColor={{ false: "#767577", true: AppColors.primary }}
                      thumbColor={hasEmergencyFund ? "#fff" : "#f4f3f4"}
                    />
                  </View>

                  {hasEmergencyFund && (
                    <View style={styles.emergencyPercentageContainer}>
                      <Text style={styles.label}>
                        Emergency Fund Percentage (1-30%)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter percentage (e.g., 10)"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={emergencyPercentage}
                        onChangeText={setEmergencyPercentage}
                        maxLength={2}
                      />
                      <Text style={styles.helperText}>
                        This percentage of each deposit will go to your
                        emergency fund
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Agreement Checkbox */}
              {showConfirmationCheckbox && (
                <View style={styles.agreementContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setAgreeToTerms(!agreeToTerms)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        agreeToTerms && styles.checkboxChecked,
                      ]}
                    >
                      {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.agreementText}>
                      I agree to lock my funds until the target date and
                      understand the terms
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <FormButton title="Create Goal" onPress={handleCreateGoal} />

                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default SafeLockModal;

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
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    fontFamily: Fonts.body,
    backgroundColor: "#f9f9f9",
  },
  emergencySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.primary,
    fontWeight: "600",
  },
  emergencyPercentageContainer: {
    marginTop: 15,
  },
  helperText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  agreementContainer: {
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body,
    color: "#333",
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 30,
  },
  cancelButton: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 50,
  },
  cancelText: {
    color: AppColors.primary,
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: Fonts.body,
  },
});
