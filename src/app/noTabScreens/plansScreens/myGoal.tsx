import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import GoalCard from "@/components/GoalCard";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SafeLockModal from "@/components/Modal";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getMyGoals, createMyGoal } from "@/services/goals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "@/services/auth";


type Goal = {
  id: number;
  title: string;
  amount: number;
  percentage: number;
  target_date: string;
  created_at: string;
};

const GoalScreen = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [showModal, setShowModal] = useState(false);
  const [goals, setGoals] = useState<{ active: Goal[]; completed: Goal[] }>({
    active: [],
    completed: [],
  });

  const fetchGoals = async () => {
    try {
      const data = await getMyGoals();
      const mapped = data.map((goal: any) => ({
        id: goal.id, 
        title: goal.goal_name,
        amount: goal.target_amount,
        percentage:
          goal.target_amount === 0
            ? 0
            : Math.round((goal.current_amount / goal.target_amount) * 100),
        target_date: goal.target_date,
        created_at: goal.created_at,
      }));
      const active = mapped.filter((goal: Goal) => goal.percentage < 100);
      const completed = mapped.filter((goal: Goal) => goal.percentage === 100);
      setGoals({ active, completed });
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/noTabScreens/plansScreens/[id]",
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
        onCreateGoal={async (newGoal) => {
          try {
            const payload = {
              goal_name: newGoal.title,
              target_amount: newGoal.amount,
              target_date: new Date(newGoal.targetDate)
                .toISOString()
                .split("T")[0],
            };

            console.log("Sending payload:", payload);

            const token = await getToken();
            if (!token) throw new Error("No token found");

            const created = await createMyGoal(payload);

            const mappedCreated = {
              id: created.id,
              title: created.goal_name,
              amount: created.target_amount,
              percentage:
                created.target_amount === 0
                  ? 0
                  : Math.round(
                      (created.current_amount / created.target_amount) * 100
                    ),
              target_date: created.target_date,
              created_at: created.created_at,
            };

            setGoals((prev) => ({
              ...prev,
              active: [...prev.active, mappedCreated],
            }));

            setShowModal(false);
          } catch (err) {
            console.error("Failed to create goal:", err);
          }
        }}
      />
      <StatusBar style="dark" />
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
    marginBottom: 20,
  },
  tabSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 30,
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
    bottom: 70,
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
