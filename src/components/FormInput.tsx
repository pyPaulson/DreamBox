import { View, Text, StyleSheet, TextInput, TextInputProps } from "react-native";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

interface FormInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  hasError?: boolean;
  customLabel?: string;
}


export default function FormInput({ label, icon, hasError, customLabel, ...props }: FormInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, hasError && styles.labelError]}>
          {hasError ? customLabel : label}
        </Text>
      )}
      <View style={[styles.inputWrapper, hasError && { borderColor: "red" }]}>
        <TextInput
          style={[styles.input, hasError && { color: "black" }]}
          placeholderTextColor={AppColors.placeholder}
          {...props}
        />
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 7,
    marginLeft: 3,
    color: AppColors.text_two,
    fontSize: 16,
    fontFamily: Fonts.body,
  },
  labelError: {
    color: "red",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.grey_two,
    borderRadius: 7,
    paddingHorizontal: 12,
    backgroundColor: AppColors.background_one,
  },
  input: {
    flex: 1,
    paddingVertical: 17,
    fontSize: 16,
    fontFamily: Fonts.body,
  },
  icon: {
    marginLeft: 8,
  },
});

