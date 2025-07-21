import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import GoalCard from "@/components/GoalCard";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SafeLockModal from "@/components/Modal";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { createSafeLock, fetchSafeLocks } from "../../services/goals";
import { getToken } from "@/services/auth"; 

type Goal = {
  id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  emergency_fund_percentage: number;
  [key: string]: any; 
};

const SaveLock = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<{
    active: Goal[];
    completed: Goal[];
  }>({
    active: [],
    completed: [],
  });


  useEffect(() => {
    const loadGoals = async () => {
      try {
        const token = await getToken();

        console.log("token: ", token);
        

        if (!token) {
          console.warn("Token not ready yet, retrying...");
          setTimeout(loadGoals, 1000); 
          return;
        }

        const data: Goal[] = await fetchSafeLocks(token);

        console.log("all goal: ", data, data.length);

        const today = new Date();

        const active = data.filter((goal: Goal) => {
          const target = new Date(goal.target_date);
          return goal.current_amount < goal.target_amount && target >= today;
        });

        console.log("active goal: ", active, active.length);


        const completed = data.filter(
          (goal: Goal) => goal.current_amount >= goal.target_amount
        );

        console.log("completed goal: ", completed);


        setGoals({ active, completed });
      } catch (err) {
        console.error("Failed to load goals:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  const handleCreateGoal = async (newGoal: {
    title: string;
    amount: number;
    percentage: number;
    emergencyFund?: number;
    targetDate: string;
  }) => {
    try {
      const token = await getToken();

      const hasEmergency = !!newGoal.emergencyFund && newGoal.emergencyFund > 0;

      const payload: {
        goal_name: string;
        target_amount: number;
        target_date: string;
        has_emergency_fund: boolean;
        agree_to_lock: boolean;
        emergency_fund_percentage?: number;
      } = {
        goal_name: newGoal.title,
        target_amount: newGoal.amount,
        target_date: new Date(newGoal.targetDate).toISOString(),
        has_emergency_fund: hasEmergency,
        agree_to_lock: true,
      };

      if (hasEmergency) {
        payload.emergency_fund_percentage = newGoal.emergencyFund;
      }

      const created = await createSafeLock(payload, token);

      setGoals((prev) => ({
        ...prev,
        active: [...prev.active, created],
      }));

      setShowModal(false);
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>SafeLock</Text>

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

      {loading ? (
        <ActivityIndicator size="large" color={AppColors.primary} />
      ) : goals[activeTab].length === 0 ? (
        <View style={styles.noGoalsContainer}>
          <Text style={styles.noGoalsText}>No goals yet</Text>
        </View>
      ) : (
        <FlatList
          data={goals[activeTab]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/noTabScreens/[id]",
                  params: {
                    id: item.id,
                    title: item.goal_name,
                    amount: item.target_amount.toString(),
                    percentage: (
                      (item.current_amount / item.target_amount) *
                      100
                    ).toFixed(0),
                    targetDate: new Date(item.target_date).toDateString(),
                    emergencyFund:
                      item.emergency_fund_percentage?.toString() ?? "0",
                  },
                })
              }
            >
              <GoalCard
                title={item.goal_name}
                amount={item.target_amount}
                percentage={(item.current_amount / item.target_amount) * 100}
                targetDate={new Date(item.target_date).toDateString()}
                emergencyFund={item.emergency_fund_percentage ?? 0}
              />
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

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
      />
    </View>
  );
};

export default SaveLock;

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
  noGoalsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  noGoalsText: {
    fontSize: 16,
    color: AppColors.grey,
    fontFamily: Fonts.bodyBold,
  },
});
