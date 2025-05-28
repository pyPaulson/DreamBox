// InfoCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import AppColors from "@/constants/AppColors";

type InfoCardProps = {
  label: string;
  value: string;
  isEditable?: boolean;
  onPress?: () => void;
};
export default function InfoCard({ label, value, isEditable, onPress }: InfoCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={isEditable ? 0.6 : 1}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <View style={styles.topRow}>
        <Text style={styles.labelText}>{label}</Text>
        {isEditable ? (
          <Ionicons name="chevron-forward" size={16} color="black" />
        ) : null}
      </View>
      <Text style={styles.valueText}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 25,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 13,
    color: AppColors.text_one,
    fontFamily: Fonts.bodyBold,
  },
  valueText: {
    fontSize: 15,
    marginTop: 14,
    color: AppColors.grey,
    fontFamily: Fonts.body,
  },
});