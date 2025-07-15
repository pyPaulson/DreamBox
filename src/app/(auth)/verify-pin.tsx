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

interface PinDotProps {
  filled: boolean;
  index: number;
}

const PinDot: React.FC<PinDotProps> = ({ filled }) => {
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

export default function VerifyPinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const expectedPin = typeof params.pin === "string" ? params.pin : "";
  const email = typeof params.email === "string" ? params.email : "";

  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const keypadLayout = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [null, "0", "backspace"],
  ];

  const handleNumberPress = (digit: string) => {
    if (pin.length < 4 && !isVerifying) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (!isVerifying) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const verifyPinMatch = () => {
    setIsVerifying(true);

    setTimeout(() => {
      if (pin === expectedPin) {
        Alert.alert("Success", "PIN confirmed!", [
          {
            text: "Continue",
            onPress: () => router.replace("/welcome"),
          },
        ]);
      } else {
        Alert.alert("Incorrect PIN", "The PINs do not match. Try again.");
        setPin("");
        setIsVerifying(false);
      }
    }, 300);
  };

  useEffect(() => {
    if (pin.length === 4 && !isVerifying) {
      verifyPinMatch();
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
      <Text style={styles.title}>Confirm your PIN</Text>
      <Text style={styles.subtitle}>Re-enter your 4 digit PIN</Text>

      <View style={styles.pinDisplay}>
        {Array.from({ length: 4 }, (_, i) => (
          <PinDot key={i} filled={pin.length > i} index={i} />
        ))}
      </View>

      <View style={styles.keypadContainer}>
        {keypadLayout.map((row, i) => renderKeypadRow(row, i))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {pin.length === 4 ? "Verifying..." : `${pin.length}/4 digits`}
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
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.background_two,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadButtonPressed: {
    backgroundColor: AppColors.primary,
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
