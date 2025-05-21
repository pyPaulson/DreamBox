import React, { JSX, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

export default function CreatePinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState<string>("");

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  if (pin.length === 4) {
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 500);
  }

  const renderButton = (
    digit?: string,
    onPress?: () => void,
    icon?: JSX.Element
  ) => (
    <TouchableOpacity
      style={styles.padButton}
      onPress={onPress ?? (() => handlePress(digit!))}
    >
      {icon ? (
        icon
      ) : digit !== undefined ? (
        <Text style={styles.digit}>{digit}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify PIN</Text>
      <Text style={styles.subtitle}>Confirm your PIN</Text>

      {/* PIN indicators */}
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.circle,
              {
                backgroundColor:
                  pin.length > index ? AppColors.primary : "transparent",
                borderColor: AppColors.primary,
              },
            ]}
          />
        ))}
      </View>

      {/* Number Pad */}
      <View style={styles.padContainer}>
        <View style={styles.row}>
          {renderButton("1")}
          {renderButton("2")}
          {renderButton("3")}
        </View>
        <View style={styles.row}>
          {renderButton("4")}
          {renderButton("5")}
          {renderButton("6")}
        </View>
        <View style={styles.row}>
          {renderButton("7")}
          {renderButton("8")}
          {renderButton("9")}
        </View>

        {/* Final Row: empty under 7, 0 under 8, back under 9 */}
        <View style={styles.lastRow}>
          <View style={{ width: 90 }} /> {/* Spacer under 7 */}
          {renderButton("0")}
          {renderButton(
            undefined,
            handleBackspace,
            <Ionicons name="backspace-outline" size={24} color="black" />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
    alignItems: "center",
    paddingTop: 70,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
  },
  pinContainer: {
    flexDirection: "row",
    gap: 16,
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 999,
    borderWidth: 1.5,
    marginVertical: 90,
  },
  padContainer: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  lastRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  padButton: {
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: AppColors.background_two,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_two,
  },
});
