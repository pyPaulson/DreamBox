import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

interface ActionCardProps {
  icon: React.ReactNode; // more accurate than `any`
  label: string;
  onPress?: () => void; // optional press handler
}

export default function ActionCard({ icon, label, onPress }: ActionCardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={styles.card} onPress={onPress}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </Container>
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
