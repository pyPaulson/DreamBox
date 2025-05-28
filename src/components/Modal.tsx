import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import FormInput from "@/components/FormInput";
import ToggleSwitch from "./ToggleSwitch";
import FormButton from "./FormButton";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreateGoal: (goal: {
    title: string;
    amount: number;
    percentage: number;
    emergencyFund?: number;
    targetDate: string;
  }) => void;
  showEmergencyOptions?: boolean;
};

const SafeLockModal = ({
  visible,
  onClose,
  onCreateGoal,
  showEmergencyOptions,
}: Props) => {
  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [emergencyToggle, setEmergencyToggle] = useState(false);
  const [percentage, setPercentage] = useState("10%");
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>Create a Plan</Text>

              <FormInput
                label="Give your plan a name"
                placeholder="E.g Rent, Travel"
                value={planName}
                onChangeText={setPlanName}
              />

              <FormInput
                label="Enter your target amount"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Pressable onPress={() => setShowDatePicker(true)}>
                <FormInput
                  label="Target Date"
                  placeholder="Select a date"
                  value={date.toDateString()}
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
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              {showEmergencyOptions && (
                <>
                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>
                      Want to save a little for emergencies?
                    </Text>
                    <ToggleSwitch
                      value={emergencyToggle}
                      onValueChange={setEmergencyToggle}
                    />
                  </View>

                  {emergencyToggle && (
                    <View style={styles.dropdownContainer}>
                      <Text style={styles.dropdownLabel}>
                        What percentage would you like to save?
                      </Text>
                      <Pressable
                        style={styles.dropdown}
                        onPress={() => setShowDropdown(!showDropdown)}
                      >
                        <Text style={styles.dropdownText}>{percentage}</Text>
                        <Ionicons
                          name={showDropdown ? "chevron-up" : "chevron-down"}
                          size={20}
                          color={AppColors.grey}
                        />
                      </Pressable>
                      {showDropdown && (
                        <View style={styles.dropdownOptions}>
                          {["10%", "20%", "30%"].map((option) => (
                            <Pressable
                              key={option}
                              onPress={() => {
                                setPercentage(option);
                                setShowDropdown(false);
                              }}
                              style={styles.dropdownItem}
                            >
                              <Text style={styles.dropdownText}>{option}</Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </>
              )}

              <View style={styles.checkboxRow}>
                <Pressable onPress={() => setConfirmed(!confirmed)}>
                  <Ionicons
                    name={confirmed ? "checkbox" : "square-outline"}
                    size={24}
                    color={AppColors.primary}
                  />
                </Pressable>
                <Text style={styles.checkboxText}>
                  I understand I cannot withdraw this money until it unlocks
                </Text>
              </View>

              <FormButton
                title="Create Plan"
                onPress={() => {
                  if (!planName || !amount || !confirmed) return;

                  const newGoal = {
                    title: planName,
                    amount: parseFloat(amount),
                    percentage: 0, // Start at 0 or let user input this if needed
                    emergencyFund: emergencyToggle
                      ? parseInt(percentage)
                      : undefined,
                    targetDate: date.toDateString(),
                  };

                  onCreateGoal(newGoal);

                  // Optional: reset form fields
                  setPlanName("");
                  setAmount("");
                  setDate(new Date());
                  setEmergencyToggle(false);
                  setConfirmed(false);
                  setShowDropdown(false);
                  setPercentage("10%");
                }}
              />

              <Pressable onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default SafeLockModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
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
    paddingBottom: 50,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.title,
    textAlign: "center",
    marginBottom: 20,
    color: AppColors.primary,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
    flex: 1,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    marginBottom: 7,
    marginLeft: 3,
    color: AppColors.text_two,
    fontSize: 16,
    fontFamily: Fonts.body,
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
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
  },
  dropdownOptions: {
    backgroundColor: AppColors.background_one,
    borderWidth: 0.3,
    borderColor: AppColors.grey_two,
    borderRadius: 7,
    marginTop: 5,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 0.25,
    borderBottomColor: AppColors.grey_two,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
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
});
