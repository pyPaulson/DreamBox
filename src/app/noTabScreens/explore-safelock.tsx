import Onboarding from "@/components/Onboarding";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

const steps = [
  {
    key: "1",
    title: "Setup SafeLock",
    subTitle: "Choose SafeLock from Plans",
    description:
      "Tap on Save on the bottom tab navigation bar, choose SafeLock from the plans available and click start now",
    image: require("@/assets/images/safe1.png"),
  },
  {
    key: "2",
    title: "Setup SafeLock",
    subTitle: "Create a goal",
    description:
      "Tap on the floating action button to create a new active goal. ",
    image: require("@/assets/images/safe2.png"),
  },
  {
    key: "3",
    title: "Setup SafeLock",
    subTitle: "Enter Goal Details",
    description:
      "Enter the goal name, target amount, and target date. You can also set an emergency fund percentage if you want to. Target date is a specified date you can withdraw your funds.",
    image: require("@/assets/images/safe3.png"),
  },
  {
    key: "4",
    title: "Setup SafeLock",
    subTitle: "Your goal is ready",
    description:
      "Start saving towards your goal. You can add money to your SafeLock at any time but can only withdraw when specified duration is up.",
    image: require("@/assets/images/safe2.png"),
  },
];

const ExploreSafeLock = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={steps}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Onboarding
            title={item.title}
            subTitle={item.subTitle}
            description={item.description}
            image={item.image}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.pagination}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default ExploreSafeLock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 110,
    left: 27,
    zIndex: 10,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
  },
});
