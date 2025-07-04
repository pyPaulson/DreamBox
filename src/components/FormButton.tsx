import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AppColors from "@/constants/AppColors";

interface FormButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export default function FormButton({
  title,
  onPress,
  loading,
}: FormButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, loading && styles.buttonDisabled]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    minHeight: 68,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    paddingVertical: 10,
    color: AppColors.text_three,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Lora",
  },
});
