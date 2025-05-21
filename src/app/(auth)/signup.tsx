import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  View,
  Modal,
  Pressable,
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the picker
    if (selectedDate) {
      handleChange("dob", format(selectedDate, "yyyy-MM-dd")); // Format the date
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button Icon at exact top-left */}
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
      <TouchableOpacity
        onPress={() => setShowGenderDropdown(true)}
        activeOpacity={0.8}
      >
        <FormInput
          placeholder="Gender"
          value={form.gender}
          onChangeText={() => {}}
          icon={<Feather name="chevron-down" size={20} color="#999" />}
          editable={false}
        />
      </TouchableOpacity>
      <Modal
        visible={showGenderDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowGenderDropdown(false)}
        >
          <View style={styles.dropdown}>
            {["Male", "Female", "Other"].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  handleChange("gender", option);
                  setShowGenderDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <FormInput
          placeholder="Date of Birth"
          value={form.dob}
          onChangeText={() => {}}
          icon={<Feather name="calendar" size={20} color="#999" />}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={form.dob ? new Date(form.dob) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
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

      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAgree(!agree)}
        activeOpacity={0.8}
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
    </ScrollView>
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  checkboxText: {
    marginLeft: 8,
    fontFamily: Fonts.body,
    fontSize: 13,
    color: "#333",
  },
  dropdown: {
    backgroundColor: AppColors.background_one,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    margin: 20,
    padding: 10,
  },
  dropdownItem: {
    padding: 12,
    fontFamily: Fonts.body,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
});
