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
}

const GoalCard = ({ title, amount, percentage }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>₵ {amount}</Text>
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
    bottom: 33,
    right: -220,
    gap: 10,
    width: 88,
  },
  progress: {
    position: "absolute",
    top: 17,
    right: 120,
  },
});

export default GoalCard;
