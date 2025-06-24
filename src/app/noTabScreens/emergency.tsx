import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import TransactionItem from "@/components/TransactionItem";
import { Feather, Ionicons } from "@expo/vector-icons";
import TransactionButton from "@/components/TransactionBtn";
import { router } from "expo-router";

const EmergencyScreen = () => {
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
            <Text style={styles.amount}>100</Text>
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
            for things like medical bills, car repairs, or job loss. The goal of
            an emergency fund is to provide a financial safety net that can help
            you avoid going into debt when unexpected expenses arise.{" "}
          </Text>

          <View style={styles.recentRow}>
            <Text style={styles.recentTitle}>Recent Transactions</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <TransactionItem
            title={"Deposit"}
            subtitle={
              "20 cedis was successfully deposited to your Emergency plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "20 cedis was successfully deposited to your Emergency plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "20 cedis was successfully deposited to your Emergency plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "200 cedis was successfully deposited to your Emergency plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "30 cedis was successfully deposited to your Emergency plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "10 cedis was successfully deposited to your Emergency plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
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
