import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { View, Text, StyleSheet } from "react-native";

interface TransactionItemProps {
  title: string;
  subtitle: string;
  date: string;
  height: number;
  width?: number;
}

export default function TransactionItem({
  title,
  subtitle,
  date,
  height = 80,
}: TransactionItemProps) {
  return (
    <View style={[styles.container, { height }]}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    padding: 6,
  },
  subtitle: {
    fontSize: 13,
    color: AppColors.text_two,
    width: 280,
    fontFamily: Fonts.body,
    paddingLeft: 6,
  },
  date: {
    fontSize: 12,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    paddingBottom: 35,
    marginLeft: -7,
  },
});
