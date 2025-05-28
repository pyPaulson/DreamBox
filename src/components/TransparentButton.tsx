import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

const TransparentButton = ({
  title,
  outline,
}: {
  title: string;
  outline?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, outline ? styles.outline : styles.filled]}
    >
      <Text
        style={[styles.text, outline ? styles.textOutline : styles.textFilled]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 6,
    alignItems: "center",
  },
  filled: {
    backgroundColor: AppColors.primary,
  },
  outline: {
    backgroundColor: AppColors.background_two,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  text: {
    fontSize: 13,
    fontFamily: Fonts.body,
  },
  textFilled: {
    color: AppColors.text_three,
  },
  textOutline: {
    color: AppColors.primary,
  },
});

export default TransparentButton;
