// components/ToggleSwitch.tsx
import { View, Switch } from "react-native";
import { useState, useEffect } from "react";
import AppColors from "@/constants/AppColors";

type ToggleSwitchProps = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

export default function ToggleSwitch({
  value,
  onValueChange,
}: ToggleSwitchProps) {
  const [internalValue, setInternalValue] = useState(value ?? false);

  // Sync internal state with prop when value is controlled from outside
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const toggleSwitch = () => {
    const newValue = !internalValue;

    if (onValueChange) {
      // Delegate to parent
      onValueChange(newValue);
    } else {
      // Manage state locally
      setInternalValue(newValue);
    }
  };

  return (
    <Switch
      trackColor={{ false: AppColors.borderColor, true: AppColors.primary }}
      thumbColor={internalValue ? "#fff" : "#f4f3f4"}
      ios_backgroundColor="#ccc"
      onValueChange={toggleSwitch}
      value={internalValue}
    />
  );
}
