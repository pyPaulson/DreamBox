import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import GoalCard from "@/components/GoalCard";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SafeLockModal from "@/components/Modal";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getMyGoals, createMyGoal } from "@/services/goals";

interface Goal {
  id: string;
  title: string;
  amount: number;
  percentage: number;
  target_date: string;
  created_at: string;
  current_amount: number;
}

interface CreateGoalData {
  title: string;
  amount: number;
  targetDate: string;
}

const GoalScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [goals, setGoals] = useState<{ active: Goal[]; completed: Goal[] }>({
    active: [],
    completed: [],
  });

  const fetchGoals = useCallback(async (showLoader: boolean = true) => {
    try {
      if (showLoader) setLoading(true);

      const data = await getMyGoals();
      console.log("MyGoals fetched:", data.length);

      const mapped: Goal[] = data.map((goal: any) => ({
        id: goal.id,
        title: goal.goal_name,
        amount: goal.target_amount,
        percentage:
          goal.target_amount === 0
            ? 0
            : Math.round((goal.current_amount / goal.target_amount) * 100),
        target_date: goal.target_date,
        created_at: goal.created_at,
        current_amount: goal.current_amount,
      }));

      const active = mapped.filter((goal: Goal) => goal.percentage < 100);
      const completed = mapped.filter((goal: Goal) => goal.percentage >= 100);

      setGoals({ active, completed });
    } catch (err: any) {
      console.error("Failed to fetch goals:", err);
      Alert.alert(
        "Error",
        "Failed to load goals. Please check your connection and try again."
      );
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load goals on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [fetchGoals])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGoals(false);
  }, [fetchGoals]);

  const handleCreateGoal = async (newGoal: CreateGoalData): Promise<void> => {
    try {
      const payload = {
        goal_name: newGoal.title.trim(),
        target_amount: newGoal.amount,
        target_date: newGoal.targetDate, // Already in ISO format from modal
      };

      console.log("Creating MyGoal with payload:", payload);

      const created = await createMyGoal(payload);
      console.log("MyGoal created successfully:", created);

      const mappedCreated: Goal = {
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
        current_amount: created.current_amount,
      };

      setGoals((prev) => ({
        ...prev,
        active: [...prev.active, mappedCreated],
      }));

      setShowModal(false);

      Alert.alert(
        "Success! 🎉",
        `Your goal "${newGoal.title}" has been created successfully.`,
        [{ text: "OK" }]
      );
    } catch (err: any) {
      console.error("Failed to create goal:", err);

      let errorMessage = "Failed to create goal. Please try again.";
      if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <Pressable>
      <GoalCard
        title={item.title}
        amount={item.amount}
        percentage={item.percentage}
        targetDate={formatDate(item.target_date)}
        emergencyFund={0}
        onPress={() =>
          router.push({
            pathname: "/noTabScreens/plansScreens/[id]" as any,
            params: {
              id: item.id.toString(),
              title: item.title,
              targetAmount: item.amount.toString(),
              currentAmount: item.current_amount?.toString() || "0",
              percentage: item.percentage.toString(),
              goalType: "mygoal",
              targetDate: formatDate(item.target_date),
            },
          })
        }
      />
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>
        {activeTab === "active"
          ? "No active goals yet. Create your first goal to start saving!"
          : "No completed goals yet. Keep saving to reach your targets!"}
      </Text>
      {activeTab === "active" && (
        <TouchableOpacity
          style={styles.createGoalButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.createGoalButtonText}>Create Goal</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>MyGoal</Text>

      <View style={styles.tabSwitch}>
        {(["active", "completed"] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({goals[tab].length})
            </Text>
            {activeTab === tab && <View style={styles.underline} />}
          </Pressable>
        ))}
      </View>

      <FlatList
        data={goals[activeTab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGoalItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {activeTab === "active" && (
        <Pressable onPress={() => setShowModal(true)} style={styles.fab}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      )}

      <SafeLockModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreateGoal={handleCreateGoal}
        showEmergencyOptions={false}
        showConfirmationCheckbox={false}
      />
      <StatusBar style="dark" />
    </View>
  );
};

export default GoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
    paddingTop: 15,
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
    fontFamily: Fonts.bodyBold,
    marginBottom: 10,
  },
  tabSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
    paddingHorizontal: 50,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: AppColors.grey,
    textAlign: "center",
  },
  activeTabText: {
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
  },
  underline: {
    height: 3,
    backgroundColor: AppColors.primary,
    width: "80%",
    marginTop: 5,
    borderRadius: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    bottom: 60,
    right: 30,
    backgroundColor: AppColors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  createGoalButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  createGoalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
  },
});
