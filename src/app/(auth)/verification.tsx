import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { resendCode, verifyEmail } from "@/services/auth";

export default function VerificationScreen() {
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";
  const [code, setCode] = useState("");

  useEffect(() => {
    if (email) {
      resendCode(email)
        .then(() => console.log("Verification code sent ✅"))
        .catch((err) => {
          console.error("Auto-send error:", err);
          Alert.alert("Error", "Failed to send verification code.");
        });
    }
  }, [email]);

  const handleVerify = async () => {
    if (!code || !email) {
      return Alert.alert("Missing Info", "Code or email is missing");
    }
    
    try {
      const res = await verifyEmail({ email, code });
      Alert.alert("Success", res.message, [
        {
          text: "OK",
          onPress: () => router.replace({
            pathname: "/create-pin",
            params: { email },
          }),
        },
      ]);
    } catch (error) {
      console.error("Verification error:", error);
      let message = "Verification failed. Try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "detail" in (error as any).response.data
      ) {
        message = (error as any).response.data.detail;
      }
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        We have sent a{" "}
        <Text style={{ color: AppColors.primary, fontFamily: Fonts.bodyBold }}>
          mail
        </Text>{" "}
        with a verification code to your email.
      </Text>

      <FormInput
        placeholder="Enter verification code"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <Text style={styles.resendPrompt}>
        Didn't get OTP?{" "}
        <Text
          style={styles.resendLink}
          onPress={async () => {
            if (!email) return Alert.alert("Missing email");

            try {
              const res = await resendCode(email);
              Alert.alert("Success", res.message);
            } catch (err) {
              console.error("Resend error:", err);
              let message = "Could not resend code.";
              if (
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                typeof (err as any).response === "object" &&
                (err as any).response !== null &&
                "data" in (err as any).response &&
                typeof (err as any).response.data === "object" &&
                (err as any).response.data !== null &&
                "detail" in (err as any).response.data
              ) {
                message = (err as any).response.data.detail;
              }
              Alert.alert("Error", message);
            }
          }}
        >
          Resend
        </Text>
      </Text>

      <FormButton title="Verify" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
    backgroundColor: AppColors.background_one,
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    color: AppColors.primary,
    textAlign: "center",
    fontFamily: Fonts.bodyBold,
    marginBottom: 15,
  },
  subtitle: {
    textAlign: "left",
    color: AppColors.text_two,
    fontSize: 15,
    marginBottom: 20,
    fontFamily: Fonts.body,
    paddingHorizontal: 10,
  },
  resendPrompt: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_two,
    marginVertical: 10,
    textAlign: "center",
  },
  resendLink: {
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
  },
});
