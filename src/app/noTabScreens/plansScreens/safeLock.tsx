import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import GoalCard from "@/components/GoalCard";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SafeLockModal from "@/components/Modal";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { createSafeLock, fetchSafeLocks } from "../../../services/goals";

interface Goal {
  id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  emergency_fund_percentage?: number;
  has_emergency_fund: boolean;
  created_at: string;
}

interface CreateGoalData {
  title: string;
  amount: number;
  emergencyFund?: number;
  targetDate: string;
}

const SaveLock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [goals, setGoals] = useState<{
    active: Goal[];
    completed: Goal[];
  }>({
    active: [],
    completed: [],
  });

  const loadGoals = useCallback(async (showInitialLoader: boolean = false) => {
    try {
      if (showInitialLoader) setInitialLoading(true);

      const data: Goal[] = await fetchSafeLocks();
      console.log("SafeLock goals loaded:", data.length);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const active = data.filter((goal: Goal) => {
        const targetDate = new Date(goal.target_date);
        targetDate.setHours(0, 0, 0, 0);
        return goal.current_amount < goal.target_amount && targetDate >= today;
      });

      const completed = data.filter(
        (goal: Goal) => goal.current_amount >= goal.target_amount
      );

      setGoals({ active, completed });
    } catch (err: any) {
      console.error("Failed to load SafeLock goals:", err);
      Alert.alert(
        "Error",
        "Failed to load goals. Please check your connection and try again."
      );
    } finally {
      if (showInitialLoader) setInitialLoading(false);
    }
  }, []);

  // Load goals on screen focus
  useFocusEffect(
    useCallback(() => {
      loadGoals(true);
    }, [loadGoals])
  );

  const handleCreateGoal = async (newGoal: CreateGoalData): Promise<void> => {
    try {
      const hasEmergency = !!newGoal.emergencyFund && newGoal.emergencyFund > 0;

      const payload = {
        goal_name: newGoal.title.trim(),
        target_amount: newGoal.amount,
        target_date: newGoal.targetDate,
        has_emergency_fund: hasEmergency,
        agree_to_lock: true,
        ...(hasEmergency && {
          emergency_fund_percentage: newGoal.emergencyFund,
        }),
      };

      console.log("Creating SafeLock with payload:", payload);

      const created = await createSafeLock(payload);
      console.log("SafeLock created successfully:", created);

      setGoals((prev) => ({
        ...prev,
        active: [...prev.active, created],
      }));

      setShowModal(false);

      Alert.alert(
        "Success! 🎉",
        `Your SafeLock goal "${newGoal.title}" has been created successfully.`,
        [{ text: "OK" }]
      );
    } catch (err: any) {
      console.error("Failed to create SafeLock goal:", err);

      let errorMessage = "Failed to create goal. Please try again.";
      if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const calculatePercentage = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.round((current / target) * 100 * 10) / 10; // Round to 1 decimal place
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderGoalItem = ({ item }: { item: Goal }) => {
    const percentage = calculatePercentage(
      item.current_amount,
      item.target_amount
    );

    return (
      <GoalCard
        title={item.goal_name}
        amount={item.current_amount} // Show current amount instead of target
        percentage={percentage}
        targetDate={formatDate(item.target_date)}
        emergencyFund={item.emergency_fund_percentage}
        onPress={() =>
          router.push({
            pathname: "./[id]" as any,
            params: {
              id: item.id,
              title: item.goal_name,
              targetAmount: item.target_amount.toString(),
              currentAmount: item.current_amount.toString(),
              goalType: "safelock",
              percentage: percentage.toString(),
              targetDate: formatDate(item.target_date),
              emergencyFund: item.emergency_fund_percentage?.toString() ?? "0",
            },
          })
        }
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>
        {activeTab === "active"
          ? "No active SafeLock goals yet. Create your first goal to start saving!"
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

      <Text style={styles.header}>SafeLock</Text>

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
        keyExtractor={(item) => item.id}
        renderItem={renderGoalItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
        showEmergencyOptions={true}
        showConfirmationCheckbox={true}
      />
    </View>
  );
};

export default SaveLock;

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
    fontFamily: "Lora-Bold",
    marginBottom: 10,
  },
  tabSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
    paddingHorizontal: 60,
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
    width: "70%",
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
