import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

const transactions = [
  {
    id: "1",
    type: "Deposit",
    amount: 500,
    category: "SaveLock",
    goalName: "Dream Car",
    date: "July 24, 2025",
  },
  {
    id: "2",
    type: "Withdrawal",
    amount: 200,
    category: "MyGoal",
    goalName: "Travel Fund",
    date: "July 20, 2025",
  },
  {
    id: "3",
    type: "Deposit",
    amount: 300,
    category: "Emergency Fund",
    goalName: null,
    date: "July 18, 2025",
  },
  {
    id: "4",
    type: "Withdrawal",
    amount: 150,
    category: "Flexi",
    goalName: null,
    date: "July 15, 2025",
  },
  {
    id: "5",
    type: "Withdrawal",
    amount: 150,
    category: "SafeLock",
    goalName: "Home Renovation",
    date: "July 15, 2025",
  },
  {
    id: "6",
    type: "Deposit",
    amount: 150,
    category: "myGoal",
    goalName: "Laptop Purchase",
    date: "July 15, 2025",
  },
  {
    id: "7",
    type: "Withdrawal",
    amount: 150,
    category: "Flexi",
    goalName: null,
    date: "July 15, 2025",
  },
  {
    id: "8",
    type: "Deposit",
    amount: 1000,
    category: "Emergency Fund",
    goalName: null,
    date: "July 10, 2025",
  },
  {
    id: "9",
    type: "Withdrawal",
    amount: 250,
    category: "SaveLock",
    goalName: "Wedding",
    date: "July 8, 2025",
  },
  {
    id: "10",
    type: "Deposit",
    amount: 400,
    category: "Flexi",
    goalName: null,
    date: "July 5, 2025",
  },
  {
    id: "11",
    type: "Withdrawal",
    amount: 100,
    category: "MyGoal",
    goalName: "Vacation",
    date: "July 2, 2025",
  },
  {
    id: "12",
    type: "Deposit",
    amount: 600,
    category: "SafeLock",
    goalName: "New Phone",
    date: "June 30, 2025",
  },
  {
    id: "13",
    type: "Withdrawal",
    amount: 350,
    category: "Emergency Fund",
    goalName: null,
    date: "June 28, 2025",
  },
  {
    id: "14",
    type: "Deposit",
    amount: 800,
    category: "MyGoal",
    goalName: "Business Startup",
    date: "June 25, 2025",
  },
];

const AccountStatementScreen = () => {
  const router = useRouter();

  const renderTransaction = (tx: (typeof transactions)[0]) => {
    const isDeposit = tx.type === "Deposit";
    const sign = isDeposit ? "+" : "-";
    const amountColor = isDeposit ? "#16a34a" : "#dc2626";
    const categoryLabel = tx.goalName
      ? `${tx.category} • ${tx.goalName}`
      : tx.category;

    return (
      <View key={tx.id} style={styles.transactionItem}>
        <View>
          <Text style={styles.categoryText}>{categoryLabel}</Text>
          <Text style={styles.dateText}>{tx.date}</Text>
        </View>
        <Text style={[styles.amountText, { color: amountColor }]}>
          {sign}₵{tx.amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Statement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Account Balance</Text>
          <Text style={styles.summaryValue}>GHS 102,500.00</Text>
        </View>
        <Text style={styles.sectionTitle}> Transactions</Text>
        {transactions.map(renderTransaction)}
      </ScrollView>
    </View>
  );
};

export default AccountStatementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
    paddingTop: 20,
  },
  headerContainer: {
    height: 90,
    backgroundColor: AppColors.background_one,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
  },
  content: {
    padding: 20,
  },
  summaryBox: {
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: Fonts.body,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.primary,
    fontFamily: Fonts.bodyBold,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    marginBottom: 20,
    color: AppColors.text_one,
  },
  transactionItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 15,
    fontFamily: Fonts.bodyBold,
    color: "#1e293b",
  },
  dateText: {
    fontSize: 13,
    color: "#64748b",
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
  },
});
