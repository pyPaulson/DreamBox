import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import CircularProgress from "./CircularProgress";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

interface Props {
  title: string;
  amount: number;
  percentage: number;
  emergencyFund?: number;
  targetDate?: string;
  onPress?: () => void;
}

const GoalCard = ({
  title,
  amount,
  percentage,
  targetDate,
  emergencyFund,
  onPress,
}: Props) => {
  // Clean up the percentage to show whole numbers or at most 1 decimal
  const cleanPercentage = Math.round(percentage * 10) / 10;
  const displayPercentage =
    cleanPercentage % 1 === 0 ? Math.round(cleanPercentage) : cleanPercentage;
  const remainingPercentage = Math.max(0, 100 - displayPercentage);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>₵ {amount.toLocaleString()}</Text>
        </View>
        <View style={styles.progressContainer}>
          <CircularProgress
            progress={displayPercentage}
            size={90}
            strokeWidth={8}
          />
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        {targetDate && (
          <View style={styles.detailRow}>
            <View style={styles.detailDot} />
            <Text style={styles.detailText}>Target: {targetDate}</Text>
          </View>
        )}

        {typeof emergencyFund === "number" && emergencyFund > 0 && (
          <View style={styles.detailRow}>
            <View style={[styles.detailDot, styles.emergencyDot]} />
            <Text style={styles.detailText}>
              Emergency Fund: {emergencyFund}%
            </Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(displayPercentage, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {displayPercentage >= 100
            ? "Goal achieved! 🎉"
            : `${remainingPercentage}% to go`}
        </Text>
      </View>

      {/* Tap indicator */}
      <View style={styles.tapIndicator}>
        <Text style={styles.tapText}>Tap for details</Text>
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoalCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.background_two,
    borderRadius: 16,
    padding: 24,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginBottom: 8,
    color: AppColors.text_one || "#000",
  },
  amount: {
    fontSize: 28,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary || "#007AFF",
    marginBottom: 4,
  },
  progressContainer: {
    alignItems: "center",
    position: "relative",
  },
  percentageText: {
    position: "absolute",
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary || "#007AFF",
    top: "50%",
    transform: [{ translateY: -8 }],
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.secondary || "#34C759",
    marginRight: 12,
  },
  emergencyDot: {
    backgroundColor:  "#FF9500",
  },
  detailText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: AppColors.secondary || "#666",
    flex: 1,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: AppColors.borderColor || "#E5E5E7",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: AppColors.primary || "#007AFF",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: AppColors.secondary || "#666",
    textAlign: "center",
  },
  tapIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor || "#E5E5E7",
  },
  tapText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: AppColors.secondary || "#666",
    marginRight: 8,
  },
  arrow: {
    opacity: 0.7,
  },
  arrowText: {
    fontSize: 14,
    color: AppColors.primary || "#007AFF",
    fontWeight: "bold",
  },
});
