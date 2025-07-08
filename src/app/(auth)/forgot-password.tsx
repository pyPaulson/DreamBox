import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { Feather } from "@expo/vector-icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendReset = () => {
    console.log("Reset instructions sent to:", email);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <SafeAreaView>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={require("../../assets/images/lock-icon.png")}
              style={styles.lockIcon}
            />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address to reset password.
          </Text>

          <FormInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Feather name="mail" size={20} color={AppColors.grey_two} />}
          />
          <TouchableOpacity style={styles.btn}>
            <FormButton title={"Reset Password"} onPress={() => {}} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Text style={styles.backToLogin}>Back to Login</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.background_one,
  },
  lockIcon: {
    width: 250,
    height: 250,
    marginBottom: 50,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    textAlign: "center",
    color: AppColors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: AppColors.text_two,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: Fonts.bodyBold,
  },
  btn: {
    width: "100%",
  },
  backToLogin: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: AppColors.primary,
    textAlign: "center",
    marginTop: 18,
  },
});
