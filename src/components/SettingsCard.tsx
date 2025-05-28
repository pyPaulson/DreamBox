// components/SettingCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

type SettingCardProps = {
  icon?: ReactNode;
  label: string;
  rightElement?: ReactNode;
  onPress?: () => void;
};

export default function SettingCard({ icon, label, rightElement, onPress }: SettingCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <View style={styles.left}>
          {icon}
          <Text style={styles.label}>{label}</Text>
        </View>
        {rightElement ? (
          <View style={styles.right}>{rightElement}</View>
        ) : (
          <Text style={styles.arrow}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: AppColors.borderColor,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: AppColors.background_one,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    marginLeft: 12,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
  },
  right: {
    alignItems: "flex-end",
  },
  arrow: {
    fontSize: 20,
    color: AppColors.grey,
  },
});
