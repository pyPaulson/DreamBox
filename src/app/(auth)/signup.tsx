import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Animated,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { registerUser } from "@/services/auth";
import { StatusBar } from "expo-status-bar";

interface SignupForm {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string; // yyyy-MM-dd
  phone_number: string; // 10 digits
  email: string;
  password: string;
  confirm_password: string;
  agree_terms: boolean;
}

type FormErrors = Partial<Record<keyof SignupForm, string>>;

export default function SignupScreen() {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [form, setForm] = useState<SignupForm>({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    agree_terms: false,
  });

  const [agree, setAgree] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [showGenderOptions, setShowGenderOptions] = useState<boolean>(false);
  const genderOptions: {
    label: string;
    value: SignupForm["gender"];
    icon: keyof typeof Feather.glyphMap;
  }[] = [
    { label: "Male", value: "Male", icon: "user" },
    { label: "Female", value: "Female", icon: "user" },
    { label: "Other", value: "Other", icon: "users" },
  ];

  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Entrance animation
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
  }, [fadeAnim, slideAnim]);

  const handleChange = <K extends keyof SignupForm>(
    key: K,
    value: SignupForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      handleChange("date_of_birth", format(date, "yyyy-MM-dd"));
    }
    setShowDateModal(false);
  };

  const validateField = (
    field: keyof SignupForm,
    value: SignupForm[typeof field]
  ): string | null => {
    switch (field) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return typeof value === "string" && emailRegex.test(value)
          ? null
          : "Please enter a valid email address";
      }
      case "phone_number": {
        const phoneRegex = /^[0-9]{10}$/;
        return typeof value === "string" && phoneRegex.test(value)
          ? null
          : "Phone number must be 10 digits";
      }
      case "password": {
        return typeof value === "string" && value.length >= 8
          ? null
          : "Password must be at least 8 characters";
      }
      case "first_name":
      case "last_name": {
        return typeof value === "string" && value.trim().length >= 2
          ? null
          : `${String(field).replace("_", " ")} must be at least 2 characters`;
      }
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!form.first_name.trim()) errors.first_name = "First name is required";
    if (!form.last_name.trim()) errors.last_name = "Last name is required";
    if (!form.gender) errors.gender = "Please select your gender";
    if (!form.date_of_birth) errors.date_of_birth = "Date of birth is required";
    if (!form.phone_number.trim())
      errors.phone_number = "Phone number is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password.trim()) errors.password = "Password is required";
    if (form.password !== form.confirm_password)
      errors.confirm_password = "Passwords do not match";
    if (!agree) errors.agree_terms = "Please agree to the terms and conditions";

    // Extra validations
    const emailErr = validateField("email", form.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validateField("phone_number", form.phone_number);
    if (phoneErr) errors.phone_number = phoneErr;

    const pwdErr = validateField("password", form.password);
    if (pwdErr) errors.password = pwdErr;

    const firstErr = validateField("first_name", form.first_name);
    if (firstErr && !errors.first_name) errors.first_name = firstErr;

    const lastErr = validateField("last_name", form.last_name);
    if (lastErr && !errors.last_name) errors.last_name = lastErr;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["#ff4444", "#ff8800", "#ffbb00", "#00aa00"];

    return {
      level: strength,
      label: strengthLabels[strength - 1] || "Very Weak",
      color: strengthColors[strength - 1] || "#ff0000",
    };
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      const firstError = Object.values(formErrors).find(
        (err): err is string => typeof err === "string" && !!err
      );
      if (firstError) {
        Alert.alert("Validation Error", firstError);
      }
      return;
    }

    setLoading(true);
    try {
      const formData = {
        ...form,
        agree_terms: Boolean(agree),
      };

      console.log("Starting registration...");
      await registerUser(formData);
      console.log("Registration successful, navigating to verification");

      router.push({
        pathname: "/verification",
        params: { email: form.email },
      });
    } catch (error: any) {
      console.error("Registration Error:", error);
      let errorMessage = "Registration failed";
      if (error?.response?.data) {
        const detail = error.response.data.detail;
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail
            .map((err: any) => err?.msg || err?.message || "Validation error")
            .join("\n");
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={100}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <View style={styles.backButtonInner}>
                  <Feather
                    name="arrow-left"
                    size={20}
                    color={AppColors.primary}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Join DreamBox and start your journey
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={[styles.halfInput, { marginRight: 8 }]}>
                  <FormInput
                    placeholder="First Name"
                    value={form.first_name}
                    onChangeText={(text) => handleChange("first_name", text)}
                  />
                  {formErrors.first_name && (
                    <Text style={styles.errorText}>
                      {formErrors.first_name}
                    </Text>
                  )}
                </View>

                <View style={[styles.halfInput, { marginLeft: 8 }]}>
                  <FormInput
                    placeholder="Last Name"
                    value={form.last_name}
                    onChangeText={(text) => handleChange("last_name", text)}
                  />
                  {formErrors.last_name && (
                    <Text style={styles.errorText}>{formErrors.last_name}</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <TouchableOpacity
                  onPress={() => setShowGenderOptions((prev) => !prev)}
                  style={[
                    styles.customDropdown,
                    formErrors.gender && styles.errorBorder,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.dropdownContent}>
                    <Feather
                      name="users"
                      size={18}
                      color={form.gender ? AppColors.primary : "#999"}
                      style={styles.dropdownIcon}
                    />
                    <Text
                      style={[
                        form.gender
                          ? styles.dropdownValue
                          : styles.dropdownPlaceholder,
                      ]}
                    >
                      {form.gender || "Select Gender"}
                    </Text>
                  </View>
                  <Feather
                    name={showGenderOptions ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>

                {showGenderOptions && (
                  <Animated.View style={styles.dropdownOptions}>
                    {genderOptions.map((option, index) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                          handleChange("gender", option.value);
                          setShowGenderOptions(false);
                        }}
                        style={[
                          styles.dropdownOption,
                          index === genderOptions.length - 1 &&
                            styles.lastOption,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Feather
                          name={option.icon}
                          size={16}
                          color={AppColors.primary}
                        />
                        <Text style={styles.dropdownOptionText}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}
                {formErrors.gender && (
                  <Text style={styles.errorText}>{formErrors.gender}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDateModal(true)}
                >
                  <FormInput
                    placeholder="Date of Birth"
                    value={form.date_of_birth}
                    editable={false}
                    icon={
                      <Feather
                        name="calendar"
                        size={20}
                        color={form.date_of_birth ? AppColors.primary : "#999"}
                      />
                    }
                  />
                </TouchableOpacity>
                {formErrors.date_of_birth && (
                  <Text style={styles.errorText}>
                    {formErrors.date_of_birth}
                  </Text>
                )}
              </View>

              {showDateModal && (
                <DateTimePicker
                  value={
                    selectedDate
                      ? selectedDate
                      : form.date_of_birth
                      ? new Date(form.date_of_birth)
                      : new Date()
                  }
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <View style={styles.inputGroup}>
                <FormInput
                  placeholder="Phone Number"
                  value={form.phone_number}
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={(text) => handleChange("phone_number", text)}
                  icon={
                    <Feather
                      name="phone"
                      size={20}
                      color={form.phone_number ? AppColors.primary : "#999"}
                    />
                  }
                />
                {formErrors.phone_number && (
                  <Text style={styles.errorText}>
                    {formErrors.phone_number}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <FormInput
                  placeholder="Email Address"
                  value={form.email}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) => handleChange("email", text)}
                  icon={
                    <Feather
                      name="mail"
                      size={20}
                      color={form.email ? AppColors.primary : "#999"}
                    />
                  }
                />
                {formErrors.email && (
                  <Text style={styles.errorText}>{formErrors.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <FormInput
                  placeholder="Password"
                  value={form.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry={!showPassword}
                  icon={
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  }
                />
                {formErrors.password && (
                  <Text style={styles.errorText}>{formErrors.password}</Text>
                )}

                {form.password.length > 0 && (
                  <View style={styles.passwordStrength}>
                    <View style={styles.strengthBar}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: `${(passwordStrength.level / 4) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.strengthText,
                        { color: passwordStrength.color },
                      ]}
                    >
                      {passwordStrength.label}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <FormInput
                  placeholder="Confirm Password"
                  value={form.confirm_password}
                  onChangeText={(text) =>
                    handleChange("confirm_password", text)
                  }
                  secureTextEntry={!showConfirmPassword}
                  icon={
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  }
                />
                {formErrors.confirm_password && (
                  <Text style={styles.errorText}>
                    {formErrors.confirm_password}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                activeOpacity={0.7}
                onPress={() => {
                  const newAgree = !agree;
                  setAgree(newAgree);
                  handleChange("agree_terms", newAgree);
                }}
              >
                <View
                  style={[styles.checkbox, agree && styles.checkboxChecked]}
                >
                  {agree && <Feather name="check" size={14} color="white" />}
                </View>
                <Text style={styles.checkboxText}>
                  I agree to the{" "}
                  <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {formErrors.agree_terms && (
                <Text style={styles.errorText}>{formErrors.agree_terms}</Text>
              )}

              <FormButton
                title="Create Account"
                onPress={handleSignup}
                loading={loading} 
              />

              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backButtonInner: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  titleContainer: { alignItems: "center" },
  title: {
    fontSize: 28,
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: AppColors.text_two,
    fontSize: 16,
    fontFamily: Fonts.body,
    opacity: 0.8,
  },
  form: {
    padding: 20,
    paddingTop: 30,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  halfInput: { flex: 1 },
  inputGroup: { marginBottom: 16 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkboxText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  linkText: {
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
  },
  customDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.grey_two,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dropdownIcon: { marginRight: 12 },
  dropdownPlaceholder: {
    color: AppColors.grey_two,
    fontFamily: Fonts.body,
    fontSize: 16,
  },
  dropdownValue: {
    color: "#000",
    fontFamily: Fonts.body,
    fontSize: 16,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: AppColors.grey_two,
    borderTopWidth: 0,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastOption: { borderBottomWidth: 0 },
  dropdownOptionText: {
    fontFamily: Fonts.body,
    color: "#333",
    fontSize: 16,
    marginLeft: 12,
  },
  passwordStrength: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginRight: 12,
  },
  strengthFill: { height: "100%", borderRadius: 2 },
  strengthText: { fontSize: 12, fontFamily: Fonts.body },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    fontFamily: Fonts.body,
    marginTop: 4,
    marginLeft: 4,
  },
  errorBorder: { borderColor: "#ff4444" },
  submitButton: { marginTop: 8 },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingBottom: 20,
  },
  loginText: {
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    fontSize: 16,
  },
  loginLink: {
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
});