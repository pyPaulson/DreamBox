// components/ToggleSwitch.tsx
import { View, Switch, StyleSheet } from "react-native";
import { useState } from "react";
import AppColors from "@/constants/AppColors";

type ToggleSwitchProps = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

export default function ToggleSwitch({ value = false, onValueChange }: ToggleSwitchProps) {
  const [isEnabled, setIsEnabled] = useState(value);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onValueChange?.(newValue);
  };

  return (
    <Switch
      trackColor={{ false: AppColors.borderColor, true: AppColors.primary }}
      thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
      ios_backgroundColor="#ccc"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
}
