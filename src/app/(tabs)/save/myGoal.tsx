import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import GoalCard from "@/components/GoalCard";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SafeLockModal from "@/components/Modal";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const GoalScreen = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [showModal, setShowModal] = useState(false);
  const [goals, setGoals] = useState({
    active: [
      {
        id: 1,
        title: "Rent",
        amount: 400,
        percentage: 47,
      },
      {
        id: 2,
        title: "Laptop",
        amount: 890,
        percentage: 17,
      },
    ],
    completed: [
      {
        id: 3,
        title: "Phone",
        amount: 2000,
        percentage: 100,
      },
      {
        id: 4,
        title: "Bills",
        amount: 1200,
        percentage: 100,
      },
    ],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>MyGoal</Text>
      <View style={styles.tabSwitch}>
        {["active", "completed"].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab as "active" | "completed")}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View style={styles.underline} />}
          </Pressable>
        ))}
      </View>

      <FlatList
        data={goals[activeTab]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/save/[id]",
                params: {
                  id: item.id.toString(),
                  title: item.title,
                  amount: item.amount.toString(),
                  percentage: item.percentage.toString(),
                },
              })
            }
          >
            <GoalCard {...item} />
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {activeTab === "active" && (
        <Pressable onPress={() => setShowModal(true)} style={styles.fab}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      )}
      <SafeLockModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreateGoal={(newGoal) => {
          setGoals((prev) => ({
            ...prev,
            active: [
              ...prev.active,
              {
                ...newGoal,
                id:
                  prev.active.length > 0
                    ? Math.max(...prev.active.map((g) => g.id), 0) + 1
                    : 1,
              },
            ],
          }));
          setShowModal(false);
        }}
      />
    </View>
  );
};

export default GoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.background_one,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 27,
    zIndex: 10,
  },
  header: {
    paddingTop: 40,
    fontSize: 20,
    color: AppColors.primary,
    textAlign: "center",
    fontFamily: "Lora-Bold",
    marginBottom: 10,
  },
  tabSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 20,
  },
  tab: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    color: AppColors.grey,
  },
  activeTabText: {
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
  },
  underline: {
    height: 5,
    backgroundColor: AppColors.primary,
    width: "110%",
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    bottom: 140,
    right: 30,
    backgroundColor: AppColors.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    color: "white",
    fontSize: 28,
    lineHeight: 32,
  },
});
