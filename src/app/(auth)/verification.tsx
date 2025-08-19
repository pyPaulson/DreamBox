import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { resendCode, verifyEmail } from "@/services/auth";

const { width } = Dimensions.get("window");

export default function VerificationScreen() {
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Countdown interval ref
const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Pulse animation for verification icon
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60); // 60 seconds countdown
  };

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Email address is missing");
      return;
    }

    setResending(true);

    try {
      console.log("Sending verification code to:", email);
      const response = await resendCode(email);

      console.log("Code sent successfully:", response);
      setCodeSent(true);
      startCountdown();

      Alert.alert(
        "Code Sent!",
        `A verification code has been sent to ${email}. Please check your email and spam folder.`
      );
    } catch (error) {
      console.error("Send code error:", error);

      let message = "Failed to send verification code.";
      let title = "Email Service Error";

      // Enhanced error handling with specific server error detection
      if (error && typeof error === "object") {
        if ("response" in error && error.response) {
          const status = (error.response as any).status;
          const responseData = (error.response as any).data;

          if (status === 500) {
            title = "Server Error";
            message =
              "Our email service is temporarily unavailable. Please try again in a few minutes or contact support if the issue persists.";
          } else if (status === 429) {
            title = "Too Many Requests";
            message =
              "You've requested too many codes. Please wait a few minutes before trying again.";
          } else if (status === 404) {
            title = "Account Not Found";
            message =
              "The email address was not found. Please check your email and try again.";
          } else if (responseData?.detail) {
            message = responseData.detail;
          } else if (responseData?.message) {
            message = responseData.message;
          } else {
            message = `Server error (${status}). Please try again later.`;
          }
        } else if ("message" in error && error.message) {
          message = error.message as string;
        } else if ("code" in error) {
          const errorCode = (error as any).code;
          if (errorCode === "NETWORK_ERROR") {
            title = "Connection Error";
            message = "Please check your internet connection and try again.";
          }
        }
      }

      Alert.alert(title, message, [
        { text: "Try Again", onPress: () => handleSendCode() },
        { text: "Cancel", style: "cancel" },
      ]);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert("Missing Code", "Please enter the verification code");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email address is missing");
      return;
    }

    if (code.length !== 6) {
      Alert.alert("Invalid Code", "Verification code must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      console.log("Verifying email with code:", { email, code });
      const response = await verifyEmail({ email, code });

      console.log("Verification successful:", response);

      Alert.alert(
        "Email Verified!",
        "Your email has been successfully verified.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace({
                pathname: "/create-pin",
                params: { email },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Verification error:", error);

      let message =
        "Verification failed. Please check your code and try again.";

      // Better error handling
      if (error && typeof error === "object") {
        if ("response" in error && error.response) {
          const responseData = (error.response as any).data;
          if (responseData?.detail) {
            message = responseData.detail;
          } else if (responseData?.message) {
            message = responseData.message;
          }
        } else if ("message" in error && error.message) {
          message = error.message as string;
        }
      }

      Alert.alert("Verification Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      Alert.alert(
        "Please Wait",
        `You can request a new code in ${countdown} seconds`
      );
      return;
    }

    await handleSendCode();
  };

  const formatEmail = (email: string) => {
    if (email.length <= 10) return email;
    const [username, domain] = email.split("@");
    if (username.length <= 3) return email;
    const maskedUsername =
      username.substring(0, 2) +
      "*".repeat(username.length - 3) +
      username.slice(-1);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Verification Icon */}
        <View style={styles.iconContainer}>
          <Animated.View
            style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}
          >
            <Feather name="mail" size={40} color={AppColors.primary} />
          </Animated.View>
        </View>

        {/* Title and Subtitle */}
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to
        </Text>
        <Text style={styles.emailText}>{formatEmail(email)}</Text>

        {/* Code Input */}
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Enter 6-digit code"
            keyboardType="numeric"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            style={styles.codeInput}
          />

          {/* Verify Button */}
          <FormButton
            title="Verify Email"
            onPress={handleVerify}
            loading={loading}
            style={styles.verifyButton}
          />
        </View>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendPrompt}>Didn't receive the code?</Text>

          <TouchableOpacity
            onPress={handleResendCode}
            style={[
              styles.resendButton,
              (countdown > 0 || resending) && styles.resendButtonDisabled,
            ]}
            disabled={countdown > 0 || resending}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.resendText,
                (countdown > 0 || resending) && styles.resendTextDisabled,
              ]}
            >
              {resending
                ? "Sending..."
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Send Code Button (if not sent initially) */}
        {!codeSent && (
          <View style={styles.sendCodeContainer}>
            <Text style={styles.sendCodePrompt}>
              Ready to verify your email?
            </Text>
            <Text style={styles.sendCodeSubtext}>
              We'll send a 6-digit code to your email address
            </Text>
            <TouchableOpacity
              onPress={handleSendCode}
              style={styles.sendCodeButton}
              disabled={resending}
              activeOpacity={0.7}
            >
              <Feather
                name="send"
                size={16}
                color="white"
                style={styles.sendIcon}
              />
              <Text style={styles.sendCodeText}>
                {resending ? "Sending..." : "Send Verification Code"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
    paddingTop: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonInner: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  title: {
    fontSize: 28,
    color: AppColors.primary,
    textAlign: "center",
    fontFamily: Fonts.bodyBold,
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    color: AppColors.text_two,
    fontSize: 16,
    fontFamily: Fonts.body,
    marginBottom: 8,
  },
  emailText: {
    textAlign: "center",
    color: AppColors.primary,
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 30,
  },
  codeInput: {
    marginBottom: 24,
    fontSize: 20,
    letterSpacing: 4,
    textAlign: "center",
    fontFamily: Fonts.bodyBold,
  },
  verifyButton: {
    marginBottom: 0,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  resendPrompt: {
    fontSize: 14,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    marginBottom: 12,
  },
  resendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.primary,
    backgroundColor: "transparent",
  },
  resendButtonDisabled: {
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  resendText: {
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  resendTextDisabled: {
    color: "#999",
  },
  sendCodeContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sendCodePrompt: {
    fontSize: 16,
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
    marginBottom: 8,
    textAlign: "center",
  },
  sendCodeSubtext: {
    fontSize: 14,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    marginBottom: 20,
    textAlign: "center",
  },
  sendCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendIcon: {
    marginRight: 10,
  },
  sendCodeText: {
    color: "white",
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
});
