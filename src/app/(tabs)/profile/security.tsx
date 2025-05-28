import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import InfoCard from "@/components/InfoCard";
import SettingCard from "@/components/SettingsCard";

const SecurityScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Security</Text>
      <SettingCard label={"Change PIN"} />
    </SafeAreaView>
  );
};

export default SecurityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  header: {
    fontSize: 20,
    color: AppColors.primary,
    marginVertical: 20,
    alignSelf: "center",
    fontFamily: Fonts.bodyBold,
    marginBottom: 30,
  },
});
