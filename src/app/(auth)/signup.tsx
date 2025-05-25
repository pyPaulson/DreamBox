import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import DropDownPicker from "react-native-dropdown-picker";

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Gender Dropdown Picker states
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState("");
  const [genderItems, setGenderItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ]);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      handleChange("dob", format(selectedDate, "yyyy-MM-dd"));
    }
    setShowDateModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Personal Details</Text>
      <Text style={styles.subtitle}>
        Ensure you enter correct details. You won’t be able to change this once
        you submit
      </Text>
      <FormInput
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
      />
      <FormInput
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
      />

      {/* Gender Dropdown */}
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={genderOpen}
          value={genderValue}
          items={genderItems}
          setOpen={setGenderOpen}
          setValue={(callback) => {
            const value = callback(genderValue);
            setGenderValue(value);
            handleChange("gender", value);
          }}
          setItems={setGenderItems}
          placeholder="Select Gender"
          placeholderStyle={{ color: AppColors.grey_two }} // Grey placeholder
          textStyle={{ color: AppColors.grey_two }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownMenu}
          zIndex={1000}
        />
      </View>

      {/* Date of Birth Picker */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowDateModal(true)}
      >
        <FormInput
          placeholder="Date of Birth"
          value={form.dob}
          editable={false}
          icon={<Feather name="calendar" size={20} color="#999" />}
        />
      </TouchableOpacity>
      {showDateModal && (
        <DateTimePicker
          value={form.dob ? new Date(form.dob) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <FormInput
        placeholder="Phone Number"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange("phone", text)}
      />
      <FormInput
        placeholder="Email Address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        icon={<Feather name="mail" size={20} color="#999" />}
      />

      <FormInput
        placeholder="Password"
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry={!showPassword}
        icon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
        value={form.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
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

      {/* Agreement Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        activeOpacity={0.8}
        onPress={() => setAgree(!agree)}
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
        onPress={() => {
          router.push("./verification");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1000, // Make sure it stacks above other elements
  },
  dropdown: {
    borderColor: AppColors.grey_two,
    backgroundColor: AppColors.text_three,
  },
  dropdownMenu: {
    borderColor: AppColors.grey_two,
    backgroundColor: AppColors.text_three,
    
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
});
