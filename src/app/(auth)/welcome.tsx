import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import FormButton from "@/components/FormButton";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Icon - using Ionicons checkmark */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkbox" size={150} color="#4787ed" />
      </View>

      {/* Welcome Message */}
      <Text style={styles.title}>Welcome to DreamBox, User!</Text>
      <Text style={styles.subtitle}>Let’s build your savings!</Text>

      <View style={styles.buttonContainer}>
        <FormButton
          title="Continue"
          onPress={() => {
            router.replace("/(tabs)/index" as any); 
            
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 29,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
    textAlign: "center",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 20,
    color: AppColors.primary,
    fontFamily: Fonts.body,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "95%",
    position: "absolute",
    bottom: 80,
  },
});
