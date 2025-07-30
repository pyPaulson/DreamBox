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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { registerUser } from "@/services/auth"; // No need to import saveToken separately
import { StatusBar } from "expo-status-bar";

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
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

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const genderOptions = ["Male", "Female", "Other"];

  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (_: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      handleChange("date_of_birth", format(date, "yyyy-MM-dd"));
    }
    setShowDateModal(false);
  };

  const validateForm = () => {
    if (!form.first_name.trim()) {
      Alert.alert("Error", "First name is required");
      return false;
    }
    if (!form.last_name.trim()) {
      Alert.alert("Error", "Last name is required");
      return false;
    }
    if (!form.gender) {
      Alert.alert("Error", "Please select your gender");
      return false;
    }
    if (!form.date_of_birth) {
      Alert.alert("Error", "Date of birth is required");
      return false;
    }
    if (!form.phone_number.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!form.email.trim()) {
      Alert.alert("Error", "Email is required");
      return false;
    }
    if (!form.password.trim()) {
      Alert.alert("Error", "Password is required");
      return false;
    }
    if (form.password !== form.confirm_password) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    if (!agree) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = {
        ...form,
        agree_terms: Boolean(agree),
      };

      console.log("Starting registration...");
      const res = await registerUser(formData);
      
      console.log("Registration successful, navigating to verification");
      
      router.push({
        pathname: "/verification",
        params: {
          email: form.email,
        },
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
            .map((err: any) => err.msg || err.message || "Validation error")
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
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Personal Details</Text>
            <Text style={styles.subtitle}>
              Ensure you enter correct details. You won't be able to change this
              once you submit
            </Text>

            <FormInput
              placeholder="First Name"
              value={form.first_name}
              onChangeText={(text) => handleChange("first_name", text)}
            />
            <FormInput
              placeholder="Last Name"
              value={form.last_name}
              onChangeText={(text) => handleChange("last_name", text)}
            />

            <View style={{ marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setShowGenderOptions((prev) => !prev)}
                style={styles.customDropdown}
                activeOpacity={0.8}
              >
                <Text
                  style={
                    form.gender
                      ? styles.dropdownValue
                      : styles.dropdownPlaceholder
                  }
                >
                  {form.gender || "Select Gender"}
                </Text>
                <Feather
                  name={showGenderOptions ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>

              {showGenderOptions && (
                <View style={styles.dropdownOptions}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        handleChange("gender", option);
                        setShowGenderOptions(false);
                      }}
                      style={styles.dropdownOption}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowDateModal(true)}
            >
              <FormInput
                placeholder="Date of Birth"
                value={form.date_of_birth}
                editable={false}
                icon={<Feather name="calendar" size={20} color="#999" />}
              />
            </TouchableOpacity>

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

            <FormInput
              placeholder="Phone Number"
              value={form.phone_number}
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={(text) => handleChange("phone_number", text)}
            />
            <FormInput
              placeholder="Email Address"
              value={form.email}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => handleChange("email", text)}
              icon={<Feather name="mail" size={20} color="#999" />}
            />

            <FormInput
              placeholder="Password"
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!showPassword}
              icon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              }
            />
            <FormInput
              placeholder="Confirm Password"
              value={form.confirm_password}
              onChangeText={(text) => handleChange("confirm_password", text)}
              secureTextEntry={!showConfirmPassword}
              icon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.8}
              onPress={() => {
                setAgree(!agree);
                handleChange("agree_terms", String(!agree));
              }}
            >
              <Feather
                name={agree ? "check-square" : "square"}
                size={20}
                color="#333"
              />
              <Text style={styles.checkboxText}>
                I acknowledge that I have read and agree to DreamBox agreement
              </Text>
            </TouchableOpacity>

            <FormButton
              title="Continue"
              onPress={handleSignup}
              loading={loading}
            />
          </View>
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
    padding: 20,
    paddingTop: 70,
    paddingBottom: 70,
    backgroundColor: AppColors.background_one,
  },
  backButton: {
    position: "absolute",
    top: 75,
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
    opacity: 0.8,
    marginBottom: 20,
    fontFamily: Fonts.body,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  checkboxText: {
    marginLeft: 8,
    fontFamily: Fonts.body,
    fontSize: 13,
    color: "#333",
  },
  customDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.grey_two,
    backgroundColor: AppColors.text_three,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 8,
  },
  dropdownPlaceholder: {
    color: AppColors.grey_two,
    fontFamily: Fonts.body,
  },
  dropdownValue: {
    color: "#000",
    fontFamily: Fonts.body,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: AppColors.grey_two,
    borderTopWidth: 0,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  dropdownOptionText: {
    fontFamily: Fonts.body,
    color: "#333",
  },
});