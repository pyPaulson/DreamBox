import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Fonts from "@/constants/Fonts";

const { width } = Dimensions.get("window");

type OnboardingStepProps = {
  title: string;
  description: string;
  image: any; 
};

const OnboardingStep = ({ title, description, image }: OnboardingStepProps) => {
  return (
    <View style={[styles.container, { width }]}>
      <Text style={styles.header}>{title}</Text>
      <Image source={image} resizeMode="contain" style={styles.image} />
      <View style={styles.textWrapper}>
        <Text style={styles.stepTitle}>Create SafeLock Plan</Text>
        <Text style={styles.stepText}>{description}</Text>
      </View>
    </View>
  );
};

export default OnboardingStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    fontFamily: Fonts.bodyBold,
    color: "#fff",
    fontSize: 22,
    marginTop: -60,
    marginBottom: 46,
  },
  image: {
    width: "100%",
    height: 460,
  },
  textWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  stepTitle: {
    fontFamily: Fonts.bodyBold,
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  stepText: {
    fontFamily: Fonts.body,
    color: "#ccc",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
