import Onboarding from "@/components/Onboarding";
import React, { useRef, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const steps = [
  {
    key: "1",
    title: "Setup SafeLock",
    description:
      "On the Save tab on the bottom tab navigation bar, choose SafeLock from the plans available and click start now",
    image: require("@/assets/images/safe1.png"),
  },
  {
    key: "2",
    title: "Track Your Savings",
    description:
      "Monitor and manage your SafeLock plans anytime in your dashboard.",
    image: require("@/assets/images/safe1.png"),
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
      <FlatList
        ref={flatListRef}
        data={steps}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Onboarding
            title={item.title}
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
