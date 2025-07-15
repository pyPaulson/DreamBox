import React, { useState, useEffect, JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { setUserPin } from "@/services/auth"; // ✅ import service

interface PinDotProps {
  filled: boolean;
  index: number;
}

const PinDot: React.FC<PinDotProps> = ({ filled, index }) => {
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    if (filled) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [filled]);

  return (
    <Animated.View
      style={[
        styles.pinDot,
        {
          backgroundColor: filled ? AppColors.primary : "transparent",
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
};

interface KeypadButtonProps {
  value?: string;
  onPress: () => void;
  icon?: JSX.Element;
  disabled?: boolean;
}

const KeypadButton: React.FC<KeypadButtonProps> = ({
  value,
  onPress,
  icon,
  disabled = false,
}) => {
  const [pressed, setPressed] = useState(false);

  if (disabled) return <View style={styles.buttonSpacer} />;

  return (
    <TouchableOpacity
      style={[styles.keypadButton, pressed && styles.keypadButtonPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.7}
    >
      {icon ? icon : <Text style={styles.buttonText}>{value}</Text>}
    </TouchableOpacity>
  );
};

export default function CreatePinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";

  const [pin, setPinInput] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const keypadLayout = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [null, "0", "backspace"],
  ];

  const handleNumberPress = (digit: string) => {
    if (pin.length < 4 && !isNavigating) {
      setPinInput((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (!isNavigating) {
      setPinInput((prev) => prev.slice(0, -1));
    }
  };

  const handlePinComplete = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing");
      return;
    }

    try {
      setIsNavigating(true);
      const res = await setUserPin(email, pin);
      Alert.alert("Success", res.message, [
        {
          text: "OK",
          onPress: () => router.replace({
            pathname: "/(auth)/verify-pin",
            params: { pin, email }, // pass both email and pin to verify screen
          }),
        },
      ]);
    } catch (err: any) {
      let message = "Failed to set PIN. Try again.";
      if (
        err?.response?.data?.detail &&
        typeof err.response.data.detail === "string"
      ) {
        message = err.response.data.detail;
      }
      Alert.alert("Error", message);
      setPinInput(""); // reset
      setIsNavigating(false);
    }
  };

  useEffect(() => {
    if (pin.length === 4 && !isNavigating) {
      handlePinComplete();
    }
  }, [pin]);

  const renderKeypadRow = (row: (string | null)[], rowIndex: number) => (
    <View key={rowIndex} style={styles.keypadRow}>
      {row.map((item, index) => {
        if (item === null) {
          return <KeypadButton key={index} onPress={() => {}} disabled />;
        }

        if (item === "backspace") {
          return (
            <KeypadButton
              key={index}
              onPress={handleBackspace}
              icon={
                <Ionicons
                  name="backspace-outline"
                  size={28}
                  color={AppColors.text_two}
                />
              }
            />
          );
        }

        return (
          <KeypadButton
            key={index}
            value={item}
            onPress={() => handleNumberPress(item)}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create a PIN</Text>
        <Text style={styles.subtitle}>Create a 4 digit Transaction PIN</Text>
      </View>

      <View style={styles.pinDisplay}>
        {Array.from({ length: 4 }, (_, index) => (
          <PinDot key={index} filled={pin.length > index} index={index} />
        ))}
      </View>

      <View style={styles.keypadContainer}>
        {keypadLayout.map((row, index) => renderKeypadRow(row, index))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {pin.length === 4 ? "PIN Created!" : `${pin.length}/4 digits`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
    justifyContent: "space-between",
    paddingVertical: 140,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    textAlign: "center",
  },
  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginVertical: 60,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  keypadContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.background_two,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  keypadButtonPressed: {
    backgroundColor: AppColors.primary,
    transform: [{ scale: 0.95 }],
  },
  buttonSpacer: {
    width: 80,
    height: 80,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_two,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    opacity: 0.7,
  },
});
