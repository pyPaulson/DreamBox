import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PlanItem from "@/components/PlanItem";
import { SafeAreaView } from "react-native-safe-area-context";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const SavingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.header}>Plans</Text>
      <PlanItem
        title={"SafeLock"}
        description={
          "Discipline your saving habits by locking your funds for a specific time. You won’t be able to withdraw until your lock period ends"
        }
        icon="lock-outline"
        onPress={() => {
          router.push("./save/safeLock");
        }}
      />
      <PlanItem
        title={"MyGoal"}
        description={
          "Set a personal saving goal with a target amount and deadline like rent, business, or phone."
        }
        icon="my-location"
      />
      <PlanItem
        title={"Flexi"}
        description={
          "Save whenever you like, how much you want. No deadlines, no restrictions, no goal, just save. You can withdraw anytime"
        }
        icon="add-box"
      />
      <PlanItem
        title={"Emergency"}
        description={
          "Set aside a portion of your funds into a secure emergency fund. Withdraw only during real emergencies."
        }
        icon="emergency"
      />
    </SafeAreaView>
  );
};

export default SavingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
  },
  header: {
    color: AppColors.primary,
    fontSize: 25,
    fontFamily: Fonts.bodyBold,
    padding: 20,
    textAlign: "center",
  },
});
