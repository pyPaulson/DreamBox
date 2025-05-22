// components/TransparentButton.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

interface TransparentButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  width?: number;
}

export default function TransactionButton({
  title,
  onPress,
  buttonStyle,
  textStyle,
  width = 140,
}: TransparentButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle, { width }]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 13,
    paddingHorizontal: 38,
    borderRadius: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: AppColors.text_three,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: AppColors.text_three,
    fontSize: 14,
    fontFamily: Fonts.body,
  },
});
