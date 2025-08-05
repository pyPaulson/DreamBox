import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import TransactionItem from "@/components/TransactionItem";
import TransactionButton from "@/components/TransactionBtn";
import { getEmergencyFund } from "../../../services/goals";
import { router } from "expo-router";

type EmergencyFundType = {
  balance: number;
  // Add other properties if needed
};

const EmergencyScreen = () => {
  const [emergencyFund, setEmergencyFund] = useState<EmergencyFundType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEmergencyData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const data = await getEmergencyFund(token);
      setEmergencyFund(data);
    } catch (error) {
      console.error("Error fetching emergency fund:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={AppColors.text_three} />
      </View>
    );
  }

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
          <Text style={styles.amountLabel}>Emergency Plan</Text>
          <View style={styles.amountRow}>
            <Text style={styles.cedi}>₵</Text>
            <Text style={styles.amount}>
              {emergencyFund ? emergencyFund.balance.toFixed(2) : "0.00"}
            </Text>
            <Ionicons
              style={styles.eyeIcon}
              name="eye-outline"
              size={25}
              color="#fff"
            />
          </View>
          <View style={styles.btn}>
            <TransactionButton title={"Withdraw"} onPress={() => {}} />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.emergencyTitle}>Emergency Fund</Text>
          <Text style={styles.emergencyText}>
            An emergency fund is a savings account that is set aside to cover
            unexpected expenses or financial emergencies. It is typically used
            for things like medical bills, car repairs, or job loss...
          </Text>

          <View style={styles.recentRow}>
            <Text style={styles.recentTitle}>Recent Transactions</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          {/* Placeholder transaction data — replace with actual transactions later */}
          {[...Array(3)].map((_, i) => (
            <TransactionItem
              key={i}
              title="Deposit"
              subtitle={`₵20 deposited to Emergency Plan`}
              date={"July 20, 2025"}
              height={90}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default EmergencyScreen;

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
  amountSec: {
    marginTop: 15,
    alignItems: "center",
  },
  amountLabel: {
    color: AppColors.text_three,
    fontSize: 17,
    fontFamily: Fonts.body,
    marginBottom: 9,
  },
  amountRow: {
    flexDirection: "row",
  },
  amount: {
    position: "absolute",
    top: 1,
    left: -25,
    color: AppColors.text_three,
    fontSize: 35,
    fontFamily: Fonts.bodyBold,
  },
  cedi: {
    position: "absolute",
    top: 8,
    right: 35,
    color: AppColors.text_three,
    fontSize: 30,
    fontFamily: Fonts.body,
  },
  eyeIcon: {
    position: "absolute",
    top: 8,
    left: 90,
  },
  btn: {
    marginTop: 70,
    width: "100%",
    alignItems: "center",
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
    marginBottom: -9,
  },
  emergencyText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: AppColors.text_two,
    marginTop: 20,
    lineHeight: 20,
  },
  recentTitle: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginTop: 20,
    marginBottom: 10,
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seeAll: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
  },
});
