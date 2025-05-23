import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import TransactionButton from "@/components/TransactionBtn";
import ActionCard from "@/components/ActionCard";
import TransactionItem from "@/components/TransactionItem";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <Ionicons
            name="person"
            size={18}
            color="#fff"
            style={styles.greetingsIcon}
          />
          <Text style={styles.greetingsText}>Hello User</Text>
          <View>
            <Ionicons
              name="notifications"
              size={20}
              color="#fff"
              style={styles.notificationIcon}
            />
          </View>
        </View>
        <View style={styles.amountSec}>
          <Text style={styles.amountLabel}>Available Balance</Text>
          <View style={styles.amountRow}>
            <Text style={styles.cedi}>₵</Text>
            <Text style={styles.amount}>100.00</Text>
            <Ionicons
              style={styles.eyeIcon}
              name="eye-outline"
              size={25}
              color="#fff"
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TransactionButton title={"Fund"} onPress={() => {}} />
          <TransactionButton title={"Withdraw"} onPress={() => {}} />
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.quickTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <ActionCard
            icon={
              <MaterialIcons name="lock-outline" size={24} color="#0D269F" />
            }
            label={"SafeLock"}
          />
          <ActionCard
            icon={<Feather name="target" size={24} color="#0D269F" />}
            label={"MyGoal"}
          />
          <ActionCard
            icon={
              <MaterialCommunityIcons
                name="tray-plus"
                size={24}
                color="#0D269F"
              />
            }
            label={"Flexi"}
          />
          <ActionCard
            icon={<MaterialIcons name="emergency" size={24} color="#0D269F" />}
            label={"Emergency"}
          />
        </View>
        <View style={styles.recentRow}>
          <Text style={styles.recentTitle}>Recent Transactions</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "500 cedis was successfully deposited to your SafeLock plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "500 cedis was successfully deposited to your SafeLock plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "500 cedis was successfully deposited to your SafeLock plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "500 cedis was successfully deposited to your SafeLock plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "500 cedis was successfully deposited to your SafeLock plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
          <TransactionItem
            title={"Deposit"}
            subtitle={
              "500 cedis was successfully deposited to your SafeLock plan"
            }
            date={"May 20, 2023"}
            height={90}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  topSection: {
    flex: 1.2,
    paddingTop: 60,
    paddingLeft: 30,
  },
  topBar: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greetingsIcon: {
    marginTop: 4,
  },
  greetingsText: {
    position: "absolute",
    top: 5,
    left: 23,
    color: AppColors.text_three,
    fontSize: 15,
    fontFamily: Fonts.body,
    width: 100,
  },
  notificationIcon: {
    marginRight: 14,
  },
  amountSec: {
    marginTop: 30,
    alignItems: "center",
  },
  amountLabel: {
    color: AppColors.text_three,
    fontSize: 17,
    fontFamily: Fonts.body,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: "row",
  },
  amount: {
    position: "absolute",
    top: 1,
    left: -40,
    color: AppColors.text_three,
    fontSize: 35,
    fontFamily: Fonts.bodyBold,
  },
  cedi: {
    position: "absolute",
    top: 5,
    right: 45,
    color: AppColors.text_three,
    fontSize: 35,
    fontFamily: Fonts.bodyBold,
  },
  eyeIcon: {
    position: "absolute",
    top: 8,
    left: 90,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 80,
    paddingHorizontal: 40,
  },

  bottomSection: {
    flex: 2.8,
    backgroundColor: AppColors.background_one,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  quickTitle: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginTop: 5,
    marginBottom: -9,
  },
  quickActions: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  recentTitle: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginTop: 20,
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seeAll: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
  },
});
