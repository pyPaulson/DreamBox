import { View, Text, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

interface ActionCardProps {
  icon: any;
  label: string;
}

export default function ActionCard({ icon, label }: ActionCardProps) {
  return (
    <View style={styles.card}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: AppColors.background_two,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    width: 88,
    height: 88,
    justifyContent: "center",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: AppColors.text_two,
    fontFamily: Fonts.bodyBold,
  },
});

// changes