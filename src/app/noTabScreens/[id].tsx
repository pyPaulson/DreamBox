import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
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
import { useState } from "react";

const GoalDetail = () => {
  const router = useRouter();
  const { title, amount, targetDate, emergencyFund, percentage } =
    useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title as string);
  const [editedAmount, setEditedAmount] = useState(amount as string);
  const [editedDate, setEditedDate] = useState(targetDate as string);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const progress = parseFloat((percentage as string) || "0");

  return (
    <>
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
                <Text style={styles.modalHeader}>Options</Text>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setEditedTitle(title as string);
                    setEditedAmount(amount as string);
                    setEditedDate(targetDate as string);
                    setModalVisible(false);
                    setEditModalVisible(true);
                  }}
                >
                  <Feather name="edit" size={20} color={AppColors.primary} />
                  <Text style={styles.modalOptionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    console.log("Withdraw pressed");
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
                    console.log("Terminate pressed");
                  }}
                >
                  <Feather name="alert-triangle" size={20} color="red" />
                  <Text style={[styles.modalOptionText, { color: "red" }]}>
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
                />

                <FormInput
                  label="Target Amount (GHS)"
                  value={editedAmount}
                  onChangeText={setEditedAmount}
                  keyboardType="numeric"
                />

                <FormInput
                  label="Target Date"
                  value={editedDate}
                  editable={false}
                  onPressIn={() => setShowDatePicker(true)}
                />

                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    value={editedDate ? new Date(editedDate) : new Date()}
                    minimumDate={new Date()}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        const dateStr = selectedDate
                          .toISOString()
                          .split("T")[0];
                        setEditedDate(dateStr);
                      }
                    }}
                  />
                )}

                <FormButton
                  title="Save Changes"
                  onPress={() => {
                    console.log(
                      "Updated values:",
                      editedTitle,
                      editedAmount,
                      editedDate
                    );
                    setEditModalVisible(false);
                  }}
                />

                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.amountSec}>
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={20}
              color="#fff"
              style={styles.notificationIcon}
              onPress={() => setModalVisible(true)}
            />
            <Text style={styles.screenTitle}>SafeLock Detail</Text>
            <Text style={styles.amountLabel}> {title} </Text>
            <View style={styles.amountRow}>
              <Text style={styles.cedi}>GHS {amount}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.emergencyTitle}>See your Progress</Text>
          <View style={styles.progressBarWrapper}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Target Amount</Text>
            <Text style={styles.value}>GHS {amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Saved Amount</Text>
            <Text style={styles.value}>GHS {amount}</Text>
          </View>
          {targetDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Target Date</Text>
              <Text style={styles.value}>{targetDate}</Text>
            </View>
          )}
          {emergencyFund && (
            <View style={styles.row}>
              <Text style={styles.label}>Emergency Fund</Text>
              <Text style={styles.value}>{emergencyFund}%</Text>
            </View>
          )}
          <View style={styles.button}>
            <FormButton title={"Top-up"} onPress={() => {}} />
          </View>
        </View>
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
  notificationIcon: {
    marginLeft: 340,
  },
  amountSec: {
    marginTop: 15,
    alignItems: "center",
  },
  screenTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontFamily: Fonts.body,
    marginBottom: 25,
    marginTop: -15,
  },
  amountLabel: {
    color: AppColors.text_three,
    fontSize: 22,
    fontFamily: Fonts.body,
    marginBottom: 24,
  },
  amountRow: {
    flexDirection: "row",
  },
  cedi: {
    position: "absolute",
    top: 8,
    right: -60,
    color: AppColors.text_three,
    fontSize: 30,
    fontFamily: Fonts.body,
  },
  progressBarWrapper: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: AppColors.primary,
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
    marginBottom: 9,
  },
  emergencyText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: AppColors.text_two,
    marginTop: 20,
    lineHeight: 20,
  },
  row: {
    marginTop: 10,
  },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontFamily: Fonts.body,
    fontSize: 15,
    marginBottom: 15,
  },
  button: {
    marginTop: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: AppColors.background_one,
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalHeader: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginBottom: 35,
    marginTop: -20,
  },

  modalOption: {
    flexDirection: "row",
    marginBottom: 20,
  },

  modalOptionText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: Fonts.body,
  },

  modalCancel: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
  },
});
