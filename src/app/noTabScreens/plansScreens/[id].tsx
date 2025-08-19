import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Feather, Ionicons } from "@expo/vector-icons";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Modal } from "react-native";
import { useState, useEffect } from "react";
import Deposit from "@/components/Deposit";
import { StatusBar } from "expo-status-bar";

interface GoalData {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  emergencyFund: string;
  percentage: number;
  goalType: string;
}

const GoalDetail: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Initialize state with params but allow for updates
  const [goalData, setGoalData] = useState<GoalData>({
    id: (Array.isArray(params.id) ? params.id[0] : params.id) || "",
    title: (params.title as string) || "",
    targetAmount: parseFloat(params.targetAmount as string) || 0,
    currentAmount: parseFloat(params.currentAmount as string) || 0,
    targetDate: (params.targetDate as string) || "",
    emergencyFund: (params.emergencyFund as string) || "",
    percentage: parseFloat(params.percentage as string) || 0,
    goalType: (params.goalType as string) || "",
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(goalData.title);
  const [editedAmount, setEditedAmount] = useState<string>(
    goalData.targetAmount.toString()
  );
  const [editedDate, setEditedDate] = useState<string>(goalData.targetDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isFundModalVisible, setFundModalVisible] = useState<boolean>(false);

  // Calculate progress
  const progress =
    goalData.targetAmount > 0
      ? Math.min((goalData.currentAmount / goalData.targetAmount) * 100, 100)
      : 0;

  const remainingAmount = Math.max(
    goalData.targetAmount - goalData.currentAmount,
    0
  );

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getAccountTypeTitle = (): string => {
    switch (goalData.goalType?.toLowerCase()) {
      case "safelock":
        return "SafeLock Detail";
      case "mygoal":
        return "MyGoal Detail";
      default:
        return "Goal Detail";
    }
  };

  const handleDepositSuccess = (depositAmount: number): void => {
    // Update the local state with the new amount
    setGoalData((prevData) => {
      const newCurrentAmount = prevData.currentAmount + depositAmount;
      const newPercentage =
        prevData.targetAmount > 0
          ? Math.min((newCurrentAmount / prevData.targetAmount) * 100, 100)
          : 0;

      return {
        ...prevData,
        currentAmount: newCurrentAmount,
        percentage: newPercentage,
      };
    });

    setFundModalVisible(false);

    Alert.alert(
      "Deposit Successful! 🎉",
      `GHS ${depositAmount.toFixed(2)} has been added to "${goalData.title}".`,
      [{ text: "OK" }]
    );
  };

  const validateEditInputs = (): { isValid: boolean; error?: string } => {
    if (!editedTitle.trim()) {
      return { isValid: false, error: "Goal title cannot be empty" };
    }

    const amount = parseFloat(editedAmount);
    if (isNaN(amount) || amount <= 0) {
      return { isValid: false, error: "Please enter a valid target amount" };
    }

    if (amount < goalData.currentAmount) {
      return {
        isValid: false,
        error: `Target amount cannot be less than current saved amount (GHS ${goalData.currentAmount.toFixed(
          2
        )})`,
      };
    }

    if (!editedDate) {
      return { isValid: false, error: "Please select a target date" };
    }

    // Check if target date is in the future
    const selectedDate = new Date(editedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { isValid: false, error: "Target date must be in the future" };
    }

    return { isValid: true };
  };

  const handleSaveEdit = (): void => {
    const validation = validateEditInputs();
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.error);
      return;
    }

    const newTargetAmount = parseFloat(editedAmount);
    const newCurrentAmount = goalData.currentAmount;

    setGoalData((prevData) => ({
      ...prevData,
      title: editedTitle.trim(),
      targetAmount: newTargetAmount,
      targetDate: editedDate,
      percentage:
        newTargetAmount > 0
          ? Math.min((newCurrentAmount / newTargetAmount) * 100, 100)
          : 0,
    }));

    setEditModalVisible(false);

    Alert.alert(
      "Goal Updated! ✅",
      "Your goal has been updated successfully.",
      [{ text: "OK" }]
    );

    // Here you would typically also make an API call to update the backend
    console.log("Updated goal:", {
      id: goalData.id,
      title: editedTitle.trim(),
      targetAmount: newTargetAmount,
      targetDate: editedDate,
    });
  };

  const handleTerminateGoal = (): void => {
    Alert.alert(
      "Terminate Goal",
      `Are you sure you want to terminate "${goalData.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Terminate",
          style: "destructive",
          onPress: () => {
            // Handle goal termination logic here
            console.log("Terminating goal:", goalData.id);
            Alert.alert(
              "Goal Terminated",
              "Your goal has been terminated successfully.",
              [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleWithdraw = (): void => {
    if (goalData.goalType?.toLowerCase() === "safelock") {
      Alert.alert(
        "SafeLock Restriction",
        "SafeLock funds are locked until the target date. Early withdrawal may incur penalties.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              Alert.alert(
                "Coming Soon",
                "Withdrawal feature will be available soon. Stay tuned!",
                [{ text: "OK" }]
              );
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Coming Soon",
        "Withdrawal feature will be available soon. Stay tuned!",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <>
      {/* Options Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>Goal Options</Text>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setEditedTitle(goalData.title);
                    setEditedAmount(goalData.targetAmount.toString());
                    setEditedDate(goalData.targetDate);
                    setModalVisible(false);
                    setEditModalVisible(true);
                  }}
                >
                  <Feather name="edit" size={20} color={AppColors.primary} />
                  <Text style={styles.modalOptionText}>Edit Goal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    handleWithdraw();
                  }}
                >
                  <Feather
                    name="download"
                    size={20}
                    color={AppColors.primary}
                  />
                  <Text style={styles.modalOptionText}>Withdraw Funds</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    handleTerminateGoal();
                  }}
                >
                  <Feather name="alert-triangle" size={20} color="#e74c3c" />
                  <Text style={[styles.modalOptionText, { color: "#e74c3c" }]}>
                    Terminate Goal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>Edit Goal</Text>

                <FormInput
                  label="Goal Title"
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  placeholder="Enter goal title"
                />

                <FormInput
                  label="Target Amount (GHS)"
                  value={editedAmount}
                  onChangeText={setEditedAmount}
                  keyboardType="numeric"
                  placeholder="Enter target amount"
                />

                <FormInput
                  label="Target Date"
                  value={formatDate(editedDate)}
                  editable={false}
                  onPressIn={() => setShowDatePicker(true)}
                  placeholder="Select target date"
                />

                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    value={editedDate ? new Date(editedDate) : new Date()}
                    minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setEditedDate(selectedDate.toISOString().split("T")[0]);
                      }
                    }}
                  />
                )}

                <FormButton title="Save Changes" onPress={handleSaveEdit} />

                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Main Screen */}
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          <View style={styles.amountSec}>
            <Text style={styles.screenTitle}>{getAccountTypeTitle()}</Text>
            <Text style={styles.amountLabel}>{goalData.title}</Text>
            <View style={styles.amountRow}>
              <Text style={styles.cedi}>
                GHS {goalData.currentAmount.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.targetText}>
              of GHS {goalData.targetAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.emergencyTitle}>Progress Overview</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressBarWrapper}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progress.toFixed(1)}% Complete
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Target Amount</Text>
              <Text style={styles.value}>
                GHS {goalData.targetAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Saved Amount</Text>
              <Text style={styles.value}>
                GHS {goalData.currentAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Remaining Amount</Text>
              <Text style={[styles.value, { color: AppColors.primary }]}>
                GHS {remainingAmount.toFixed(2)}
              </Text>
            </View>

            {goalData.targetDate && (
              <View style={styles.row}>
                <Text style={styles.label}>Target Date</Text>
                <Text style={styles.value}>
                  {formatDate(goalData.targetDate)}
                </Text>
              </View>
            )}

            {goalData.emergencyFund && goalData.emergencyFund !== "0" && (
              <View style={styles.row}>
                <Text style={styles.label}>Emergency Fund</Text>
                <Text style={styles.value}>{goalData.emergencyFund}%</Text>
              </View>
            )}
          </View>

          <View style={styles.button}>
            <FormButton
              title={progress >= 100 ? "Goal Completed! 🎉" : "Add Funds"}
              onPress={() => {
                if (progress >= 100) {
                  Alert.alert(
                    "Congratulations! 🎉",
                    "You have successfully completed this goal!",
                    [{ text: "OK" }]
                  );
                } else {
                  setFundModalVisible(true);
                }
              }}
              disabled={progress >= 100}
            />
          </View>

          <Deposit
            visible={isFundModalVisible}
            onClose={() => setFundModalVisible(false)}
            goalId={goalData.id || null}
            goalType={goalData.goalType}
            onDepositSuccess={handleDepositSuccess}
          />
        </View>

        <StatusBar style="light" />
      </View>
    </>
  );
};

export default GoalDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  topContainer: {
    flex: 1.2,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 74,
    left: 27,
    zIndex: 10,
  },
  optionsButton: {
    position: "absolute",
    top: 74,
    right: 27,
    zIndex: 10,
  },
  amountSec: {
    marginTop: 15,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  screenTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontFamily: Fonts.body,
    marginBottom: 25,
    marginTop: 15,
  },
  amountLabel: {
    color: AppColors.text_three,
    fontSize: 22,
    fontFamily: Fonts.bodyBold,
    marginBottom: 24,
    textAlign: "center",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cedi: {
    color: AppColors.text_three,
    fontSize: 32,
    fontFamily: Fonts.bodyBold,
    textAlign: "center",
  },
  targetText: {
    color: AppColors.text_three,
    fontSize: 16,
    fontFamily: Fonts.body,
    marginTop: 8,
    opacity: 0.8,
  },
  bottomContainer: {
    flex: 3.5,
    backgroundColor: AppColors.background_one,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  emergencyTitle: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginTop: 5,
    marginBottom: 20,
    color: AppColors.primary,
  },
  progressSection: {
    marginBottom: 25,
  },
  progressBarWrapper: {
    height: 12,
    backgroundColor: "#e8f4f8",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: AppColors.primary,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: AppColors.text_two,
  },
  value: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#333",
  },
  button: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: AppColors.background_one,
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginBottom: 25,
    textAlign: "center",
    color: AppColors.primary,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalOptionText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: Fonts.body,
    color: "#333",
  },
  modalCancel: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
    paddingVertical: 10,
  },
});
