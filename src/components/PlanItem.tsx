import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

interface PlanItemProps {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}

export default function PlanItem({
  title,
  description,
  icon,
  onPress,
}: PlanItemProps) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <MaterialIcons
          name={icon}
          size={33}
          color="#000080"
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onPress}>
        <Text style={styles.startNow}>
          Start Now <Text style={styles.arrow}>↠</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.background_two,
    paddingBottom: 7,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  icon: {
    marginRight: 12,
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    color: AppColors.text_one,
  },
  description: {
    fontSize: 14,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    marginTop: 8,
    width: 300,
  },
  startNow: {
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  arrow: {
    fontSize: 26,
  },
});
