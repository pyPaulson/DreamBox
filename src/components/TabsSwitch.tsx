import AppColors from "@/constants/AppColors";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type TabsSwitchProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

export default function TabsSwitch({ selectedTab, setSelectedTab }: TabsSwitchProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setSelectedTab("Active")}>
        <Text
          style={[styles.tab, selectedTab === "Active" && styles.activeTab]}
        >
          Active
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedTab("Completed")}>
        <Text
          style={[styles.tab, selectedTab === "Completed" && styles.activeTab]}
        >
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
    gap: 20,
  },
  tab: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.grey,
  },
  activeTab: {
    color: AppColors.primary,
    borderBottomWidth: 2,
    borderBottomColor: AppColors.primary,
    paddingBottom: 4,
  },
});
