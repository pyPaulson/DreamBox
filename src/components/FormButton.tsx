import AppColors from "@/constants/AppColors";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface FormButtonProps {
  title: string;
  onPress: () => void;
}

export default function FormButton({ title, onPress }: FormButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    paddingVertical: 10,
    color: AppColors.text_three,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Lora",
  },
});
