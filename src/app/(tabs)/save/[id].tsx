import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Feather, Ionicons } from "@expo/vector-icons";
import FormButton from "@/components/FormButton";

const GoalDetail = () => {
  const router = useRouter();
  const { title, amount, targetDate, emergencyFund, percentage } =
    useLocalSearchParams();

  const progress = parseFloat((percentage as string) || "0");

  return (
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
            onPress={() => {
              console.log("Notification icon pressed");
            }}
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
});
