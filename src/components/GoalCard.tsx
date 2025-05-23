// components/GoalCard.tsx
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
  targetDate: string; 
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
          <Text style={styles.targetDate}>Target Date: {targetDate}</Text>
          <Text style={styles.EmergencyFund}>
            Emergency Fund: {emergencyFund}%
          </Text>
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
    padding: 30,
    marginVertical: 10,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    position: "relative",
    top: 40,
    left: 10,
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
  },
  amount: {
    position: "relative",
    top: 40,
    left: 10,
    fontSize: 16,
    marginTop: 4,
    fontFamily: Fonts.bodyBold,
  },
  buttons: {
    position: "relative",
    bottom: 40,
    right: -220,
    gap: 10,
    width: 88,
  },
  targetDate: {
    position: "absolute",
    top: -15,
    left: 10,
    width: 200,
    fontFamily: Fonts.body,
  },
  EmergencyFund: {
    position: "relative",
    top: 101,
    left: 10,
    fontFamily: Fonts.body,
  },
  progress: {
    position: "absolute",
    top: 30,
    right: 120,
  },
});

export default GoalCard;
