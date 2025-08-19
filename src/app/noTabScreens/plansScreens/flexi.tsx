import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import TransactionItem from "@/components/TransactionItem";
import { Feather, Ionicons } from "@expo/vector-icons";
import TransactionButton from "@/components/TransactionBtn";
import { router } from "expo-router";
import { getFlexiAccount, createFlexiAccount } from "@/services/goals";
import Deposit from "@/components/Deposit";

interface FlexiAccountData {
  id: string;
  user_id: string;
  balance: number;
}

const FlexiScreen: React.FC = () => {
  const [flexiData, setFlexiData] = useState<FlexiAccountData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showEyeIcon, setShowEyeIcon] = useState<boolean>(true);
  const [isFundModalVisible, setFundModalVisible] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const loadFlexiAccount = useCallback(async (showLoader: boolean = true) => {
    try {
      if (showLoader) setLoading(true);

      const data = await getFlexiAccount();
      setFlexiData(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to load flexi account:", err);

      if (err.message?.includes("not found") || err.response?.status === 404) {
        setError("no_account");
        setFlexiData(null);
      } else {
        setError(err.message || "Failed to load account");
        setFlexiData(null);
      }
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load account on screen focus
  useFocusEffect(
    useCallback(() => {
      loadFlexiAccount();
    }, [loadFlexiAccount])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFlexiAccount(false);
  }, [loadFlexiAccount]);

  const handleCreateFlexiAccount = async (): Promise<void> => {
    try {
      setIsCreating(true);
      const newAccount = await createFlexiAccount();
      setFlexiData(newAccount);
      setError(null);

      Alert.alert(
        "Success! 🎉",
        "Your Flexi Savings account has been created successfully.",
        [{ text: "OK" }]
      );
    } catch (err: any) {
      console.error("Failed to create flexi account:", err);

      let errorMessage = "Failed to create Flexi account. Please try again.";
      if (err.message?.includes("already exists")) {
        errorMessage = "You already have a Flexi account. Refreshing...";
        // Try to load the existing account
        loadFlexiAccount();
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDepositSuccess = (depositAmount: number): void => {
    if (flexiData) {
      setFlexiData((prev) => ({
        ...prev!,
        balance: prev!.balance + depositAmount,
      }));
    }
    setFundModalVisible(false);

    Alert.alert(
      "Deposit Successful! 🎉",
      `GHS ${depositAmount.toFixed(
        2
      )} has been added to your Flexi Savings account.`,
      [{ text: "OK" }]
    );
  };

  const toggleAmountVisibility = (): void => {
    setShowEyeIcon(!showEyeIcon);
  };

  const formatBalance = (balance: number): string => {
    return showEyeIcon ? balance.toFixed(2) : "*****";
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.amountSec}>
            <Text style={styles.amountLabel}>Flexi Savings</Text>
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginTop: 20 }}
            />
            <Text style={styles.loadingText}>Loading your account...</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.loadingBottomContainer}>
            <ActivityIndicator size="large" color={AppColors.primary} />
          </View>
        </View>
      </View>
    );
  }

  // Show create account option if no account exists
  if (error === "no_account") {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.amountSec}>
            <Text style={styles.amountLabel}>Flexi Savings</Text>
            <Text style={styles.noAccountText}>
              You don't have a Flexi account yet
            </Text>
            <TouchableOpacity
              style={styles.createAccountBtn}
              onPress={handleCreateFlexiAccount}
              disabled={isCreating}
            >
              <Text style={styles.createAccountText}>
                {isCreating ? "Creating..." : "Create Flexi Account"}
              </Text>
              {isCreating && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[AppColors.primary]}
              />
            }
          >
            <Text style={styles.emergencyTitle}>Flexi Savings</Text>
            <View >
              <Text style={styles.emergencyText}>
                A Flexi account gives you the freedom to save and withdraw your
                money anytime you want. Unlike SafeLock, there are no
                restrictions on when you can access your funds, making it
                perfect for short-term savings goals or keeping money aside for
                flexible spending.
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Key Features:</Text>
              <View style={styles.featureItem}>
                <Feather
                  name="check-circle"
                  size={16}
                  color={AppColors.primary}
                />
                <Text style={styles.featureText}>
                  No withdrawal restrictions
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Feather
                  name="check-circle"
                  size={16}
                  color={AppColors.primary}
                />
                <Text style={styles.featureText}>Instant access to funds</Text>
              </View>
              <View style={styles.featureItem}>
                <Feather
                  name="check-circle"
                  size={16}
                  color={AppColors.primary}
                />
                <Text style={styles.featureText}>
                  Perfect for emergency savings
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Feather
                  name="check-circle"
                  size={16}
                  color={AppColors.primary}
                />
                <Text style={styles.featureText}>Secure and reliable</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.amountSec}>
          <Text style={styles.amountLabel}>Flexi Savings</Text>
          <View style={styles.amountRow}>
            <Text style={styles.cedi}>₵</Text>
            <Text style={styles.amount}>
              {formatBalance(flexiData?.balance || 0)}
            </Text>
            <TouchableOpacity onPress={toggleAmountVisibility}>
              <Ionicons
                style={styles.eyeIcon}
                name={showEyeIcon ? "eye-outline" : "eye-off-outline"}
                size={25}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TransactionButton
              title={"Fund"}
              onPress={() => setFundModalVisible(true)}
            />
            <TransactionButton
              title={"Withdraw"}
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Withdrawal feature will be available soon. Stay tuned!",
                  [{ text: "OK" }]
                );
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[AppColors.primary]}
            />
          }
        >
          <Text style={styles.emergencyTitle}>Flexi Savings</Text>
          <Text style={styles.emergencyText}>
            A Flexi account gives you the freedom to save and withdraw your
            money anytime you want. Unlike SafeLock, there are no restrictions
            on when you can access your funds, making it perfect for short-term
            savings goals or keeping money aside for flexible spending.
          </Text>

          {error && error !== "no_account" && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => loadFlexiAccount()}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.recentRow}>
            <Text style={styles.recentTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder transactions - Replace with actual transaction data */}
          <View style={styles.transactionsContainer}>
            <TransactionItem
              title={"Deposit"}
              subtitle={
                "50 cedis was successfully deposited to your Flexi account"
              }
              date={"May 20, 2023"}
              height={90}
            />
            <TransactionItem
              title={"Withdrawal"}
              subtitle={"25 cedis was withdrawn from your Flexi account"}
              date={"May 18, 2023"}
              height={90}
            />
            <TransactionItem
              title={"Deposit"}
              subtitle={
                "100 cedis was successfully deposited to your Flexi account"
              }
              date={"May 15, 2023"}
              height={90}
            />
          </View>
        </ScrollView>
      </View>

      {/* Deposit Modal */}
      <Deposit
        visible={isFundModalVisible}
        onClose={() => setFundModalVisible(false)}
        goalId={null}
        goalType="flexi"
        onDepositSuccess={handleDepositSuccess}
      />
    </View>
  );
};

export default FlexiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  topContainer: {
    flex: 1.2,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 74,
    left: 27,
    zIndex: 10,
  },
  amountSec: {
    marginTop: 15,
    alignItems: "center",
  },
  amountLabel: {
    color: AppColors.text_three,
    fontSize: 17,
    fontFamily: Fonts.body,
    marginBottom: 9,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    color: AppColors.text_three,
    fontSize: 30,
    fontFamily: Fonts.bodyBold,
    marginLeft: 5,
  },
  cedi: {
    color: AppColors.text_three,
    fontSize: 27,
    fontFamily: Fonts.body,
    marginRight: 15,
    marginLeft: 15,
  },
  eyeIcon: {
    marginLeft: 15,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 40,
  },
  bottomContainer: {
    flex: 3.5,
    backgroundColor: AppColors.background_one,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  emergencyTitle: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginTop: 5,
    marginBottom: 10,
    color: AppColors.primary,
  },
  emergencyText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: AppColors.text_two,
    marginTop: 10,
    lineHeight: 22,
  },
  recentTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    marginTop: 25,
    marginBottom: 10,
    color: AppColors.primary,
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    marginTop: 25,
    fontSize: 14,
    fontFamily: Fonts.body,
    color: AppColors.primary,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: AppColors.text_three,
    fontFamily: Fonts.body,
  },
  loadingBottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    fontFamily: Fonts.body,
    flex: 1,
    marginLeft: 10,
  },
  retryText: {
    color: AppColors.primary,
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    marginLeft: 10,
  },
  noAccountText: {
    color: AppColors.text_three,
    fontSize: 16,
    fontFamily: Fonts.body,
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  createAccountBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  createAccountText: {
    color: AppColors.text_three,
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    textAlign: "center",
  },
  featuresContainer: {
    marginTop: 25,
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
  },
  featuresTitle: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
    marginLeft: 10,
  },
  transactionsContainer: {
    marginTop: 10,
  },
});
