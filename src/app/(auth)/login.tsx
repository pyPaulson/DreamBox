import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import LoginFormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    router.push("/(tabs)");
    console.log("Logging in with:", email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image
            source={require("@/assets/images/LoginLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcome}>Good to see you!</Text>
          <Text style={styles.subtext}>Let's build your savings!..</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.loginPrompt}>
            Login into your account to continue
          </Text>
          <LoginFormInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon={<Feather name="mail" size={25} color="#636363" />}
          />
          <LoginFormInput
            label="Password"
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#636363"
                onPress={() => setShowPassword((prev) => !prev)}
              />
            }
          />
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <FormButton title="Login" onPress={handleLogin} />

          <Text style={styles.signupPrompt}>
            Don’t have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => router.push("../signup")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.primary },
  topSection: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: -50,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.text_three,
    marginBottom: 6,
    fontFamily: Fonts.body,
  },
  subtext: {
    color: AppColors.text_three,
    fontFamily: Fonts.body,
  },
  formContainer: {
    flex: 2,
    backgroundColor: AppColors.background_one,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  loginPrompt: {
    fontSize: 15,
    marginBottom: 20,
    marginLeft: 3,
    color: "#333",
    opacity: 0.65,
    fontFamily: Fonts.body,
  },
  forgot: {
    textAlign: "right",
    marginTop: -5,
    marginBottom: 9,
    fontWeight: "bold",
    opacity: 0.6,
    fontFamily: Fonts.bodyBold,
  },
  signupPrompt: {
    marginTop: 20,
    textAlign: "center",
    color: AppColors.grey,
    fontFamily: Fonts.body,
  },
  signupLink: {
    fontWeight: "bold",
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
  },
});
