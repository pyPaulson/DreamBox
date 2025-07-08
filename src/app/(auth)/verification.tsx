import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function VerificationScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        We have sent a{" "}
        <Text style={{ color: AppColors.primary, fontFamily: Fonts.bodyBold }}>
          {" "}
          mail{" "}
        </Text>{" "}
        with a verification code to your email.
      </Text>
      <FormInput
        placeholder="Enter verification code"
        keyboardType="numeric"
        maxLength={6}
      />
      <Text style={styles.resendPrompt}>
        Didn't get OTP?{" "}
        <Text style={styles.resendLink} onPress={() => {}}>
          Resend
        </Text>
      </Text>
      <FormButton title="Verify" onPress={() => {
       router.replace("/create-pin");
      }} />
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
