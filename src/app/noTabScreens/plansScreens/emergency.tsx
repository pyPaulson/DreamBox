import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import TransactionItem from "@/components/TransactionItem";
import { getEmergencyFund } from "@/services/goals";

interface Transaction {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
}

interface EmergencyFundData {
  id: string;
  balance: number;
  total_withdrawn: number;
  last_deposit_days: number;
  transactions?: Transaction[];
  // created_at: string;
  // updated_at: string;
}

const EmergencyScreen: React.FC = () => {
  const [emergencyData, setEmergencyData] = useState<EmergencyFundData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);

  const loadEmergencyFund = useCallback(async (isRefresh: boolean = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const data: EmergencyFundData = await getEmergencyFund();
      setEmergencyData(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Failed to load emergency fund:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load emergency fund"
      );

      if (!isRefresh) setEmergencyData(null);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEmergencyFund(false);
    }, [loadEmergencyFund])
  );

  const onRefresh = useCallback(() => {
    loadEmergencyFund(true);
  }, [loadEmergencyFund]);

  const handleWithdraw = () => {
    if (!emergencyData || emergencyData.balance <= 0) {
      Alert.alert(
        "Insufficient Funds",
        "You don't have enough funds in your Emergency Fund to withdraw."
      );
      return;
    }

    Alert.alert(
      "Emergency Withdrawal",
      "Are you sure you want to make an emergency withdrawal? This should only be used for genuine emergencies.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          style: "destructive",
          onPress: () => router.push("/emergency/withdraw" as any),
        },
      ]
    );
  };

  const toggleBalanceVisibility = () => {
    setShowBalance((prev) => !prev);
  };

  const formatAmount = (amount?: number | null): string =>
    typeof amount === "number" && !isNaN(amount)
      ? amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  const getTotalWithdrawn = (): number => emergencyData?.total_withdrawn ?? 0;
  const getLastDepositDays = (): number =>
    emergencyData?.last_deposit_days ?? 0;
  const getBalance = (): number => emergencyData?.balance ?? 0;

  // ---------------- Loading State ----------------
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Fund</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading your Emergency Fund...</Text>
        </View>
      </View>
    );
  }

  // ---------------- Empty State (no data yet) ----------------
  if (!emergencyData && !error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Fund</Text>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIcon}>
              <Ionicons
                name="shield-outline"
                size={64}
                color={AppColors.primary}
              />
            </View>
            <Text style={styles.emptyStateTitle}>
              Start Your Emergency Fund
            </Text>
            <Text style={styles.emptyStateText}>
              Your Emergency Fund is automatically funded from SafeLock goals
              with emergency fund enabled. Create a SafeLock to start building
              your safety net.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/savings/safelock" as any)}
            >
              <Text style={styles.createButtonText}>Create SafeLock Goal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why Emergency Fund?</Text>
            <Text style={styles.infoText}>
              An emergency fund helps you handle unexpected expenses like
              medical bills, car repairs, or job loss without going into debt.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------------- Error State ----------------
  if (error && !emergencyData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Fund</Text>
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadEmergencyFund(false)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---------------- Main UI ----------------
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Fund</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
            tintColor={AppColors.primary}
          />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.currency}>₵</Text>
                <Text style={styles.balanceAmount}>
                  {showBalance ? formatAmount(getBalance()) : "••••••"}
                </Text>
                <TouchableOpacity
                  onPress={toggleBalanceVisibility}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showBalance ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={AppColors.text_two}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.shieldIcon}>
              <Ionicons
                name="shield-checkmark"
                size={32}
                color={AppColors.primary}
              />
            </View>
          </View>

          {/* Withdraw Button */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.withdrawButton]}
              onPress={handleWithdraw}
            >
              <Ionicons name="card-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Emergency Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="wallet" size={20} color="#34C759" />
            <Text style={styles.statValue}>₵{formatAmount(getBalance())}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="arrow-down" size={20} color="#FF3B30" />
            <Text style={styles.statValue}>
              ₵{formatAmount(getTotalWithdrawn())}
            </Text>
            <Text style={styles.statLabel}>Withdrawn</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="shield-checkmark" size={20} color="#007AFF" />
            <Text style={styles.statValue}>{getLastDepositDays()}</Text>
            <Text style={styles.statLabel}>Days Ago</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Emergency Fund</Text>
          <Text style={styles.infoText}>
            Your Emergency Fund is automatically funded from your SafeLock
            goals. Withdraw only for genuine emergencies like medical bills, job
            loss, or urgent repairs.
          </Text>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {emergencyData?.transactions?.length ? (
              emergencyData.transactions
                .slice(0, 3)
                .map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id || index}
                    title={transaction.type}
                    subtitle={transaction.description}
                    date={new Date(transaction.date).toLocaleDateString()}
                    height={70}
                  />
                ))
            ) : (
              <>
                <TransactionItem
                  title="Fund Deposit"
                  subtitle="₵20 deposited to Emergency fund"
                  date="Dec 20, 2024"
                  height={70}
                />
                <TransactionItem
                  title="Fund Deposit"
                  subtitle="₵50 deposited to Emergency fund"
                  date="Dec 18, 2024"
                  height={70}
                />
              </>
            )}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background_one },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: { position: "absolute", left: 20, top: 55, padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
  },
  content: { flex: 1, paddingHorizontal: 20 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppColors.text_two,
    fontFamily: Fonts.body,
  },

  balanceCard: {
    backgroundColor: AppColors.background_two,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
    marginBottom: 8,
  },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  currency: { fontSize: 24, fontFamily: Fonts.body, color: AppColors.text_one },
  balanceAmount: {
    fontSize: 32,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_one,
    marginLeft: 4,
  },
  eyeButton: { marginLeft: 12, padding: 4 },
  shieldIcon: {
    backgroundColor: AppColors.primary + "20",
    padding: 12,
    borderRadius: 12,
  },

  actionButtons: { flexDirection: "row" },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
  },
  withdrawButton: { backgroundColor: AppColors.primary },
  actionButtonText: { fontSize: 14, fontFamily: Fonts.bodyBold, color: "#fff" },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppColors.background_two,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_one,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
  },

  infoCard: {
    backgroundColor: AppColors.primary + "10",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_one,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
    lineHeight: 20,
  },

  transactionsSection: { marginBottom: 20 },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_one,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: AppColors.primary,
  },
  transactionsList: { marginTop: 4 },

  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    backgroundColor: AppColors.primary + "20",
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: Fonts.bodyBold,
    color: AppColors.text_one,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: { fontSize: 16, fontFamily: Fonts.bodyBold, color: "#fff" },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    color: "#f44336",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
    textAlign: "center",
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  retryButtonText: { fontSize: 16, fontFamily: Fonts.bodyBold, color: "#fff" },

  bottomSpacing: { height: 40 },
});
