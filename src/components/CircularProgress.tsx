// components/CircularProgress.tsx
import AppColors from "@/constants/AppColors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  label?: string;
}

export default function CircularProgress({
  size = 60,
  strokeWidth = 6,
  progress,
  label = "",
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#BCB6B6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#001d87"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={styles.label}>
        {progress}%{"\n"}Completed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  label: {
    position: "absolute",
    textAlign: "center",
    fontSize: 10,
    color: AppColors.primary,
    fontWeight: "bold",
  },
});
