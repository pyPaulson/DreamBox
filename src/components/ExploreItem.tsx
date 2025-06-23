import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

type ExploreCardProps = {
  title: string;
  description: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
};

const ExploreCard = ({
  title,
  description,
  iconName,
  onPress,
}: ExploreCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <MaterialCommunityIcons
        name={iconName}
        size={50}
        color={AppColors.primary}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
};

export default ExploreCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: "#000",
  },
  description: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
});
