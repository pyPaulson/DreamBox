import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import ExploreCard from "@/components/ExploreItem";

const ExploreScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Navigate on all the features up here</Text>
        <Text style={styles.subheading}>
          Discover gestures to navigate your way on this platform with ease
        </Text>

        <View style={styles.cardWrapper}>
          <ExploreCard
            title="SafeLock"
            description="Explore how to create and use SafeLock plan to improve your saving behavior."
            iconName="lock-outline"
            onPress={() => router.push("/explore/explore-safelock")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
  },
  scroll: {
    padding: 20,
  },
  heading: {
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    color: AppColors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subheading: {
    fontFamily: Fonts.body,
    fontSize: 13,
    textAlign: "center",
    color: AppColors.primary,
    marginBottom: 24,
  },
  cardWrapper: {
    gap: 0, // no vertical gap, as there's a border between cards
  },
});
