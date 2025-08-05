import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ⬅️ Add this
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import FormButton from "@/components/FormButton";

export default function WelcomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("User");

  useEffect(() => {
    const loadFirstName = async () => {
      const name = await AsyncStorage.getItem("user_first_name");
      if (name) {
        setFirstName(name);
      }
    };
    loadFirstName();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkbox" size={150} color="#4787ed" />
      </View>

      <Text style={styles.title}>Welcome to DreamBox, {firstName}!</Text>
      <Text style={styles.subtitle}>Please Login and let’s start building your savings!</Text>

      <View style={styles.buttonContainer}>
        <FormButton
          title="Continue to Login"
          onPress={() => {
            router.replace("/login");
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
    marginBottom: 30,
  },
  title: {
    fontSize: 31,
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
    bottom: 100,
  },
});
