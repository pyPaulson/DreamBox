import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CircularProgress from "./CircularProgress";
import TransparentButton from "./TransparentButton";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

interface Props {
  title: string;
  amount: number;
  percentage: number;
  emergencyFund?: number;
  targetDate?: string;
}

const GoalCard = ({
  title,
  amount,
  percentage,
  targetDate,
  emergencyFund,
}: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>₵ {amount}</Text>
          {targetDate && (
            <Text style={styles.targetDate}>Target Date: {targetDate}</Text>
          )}

          {typeof emergencyFund === "number" && (
            <Text style={styles.EmergencyFund}>
              Emergency Fund: {emergencyFund}%
            </Text>
          )}
        </View>
        <View style={styles.progress}>
          <CircularProgress progress={percentage} size={85} strokeWidth={12} />
        </View>
      </View>
      <View style={styles.buttons}>
        <TransparentButton title="+Top-up" />
        <TransparentButton title="Withdraw" outline />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.background_two,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    marginBottom: 4,
  },
  targetDate: {
    fontFamily: Fonts.body,
    marginBottom: 4,
  },
  EmergencyFund: {
    fontFamily: Fonts.body,
    marginBottom: 4,
  },
  progress: {
    marginRight: 48,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
});


export default GoalCard;
