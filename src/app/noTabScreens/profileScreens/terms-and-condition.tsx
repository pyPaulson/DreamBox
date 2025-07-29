import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TermsAndConditionsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: January 15, 2025</Text>

        <Text style={styles.paragraph}>
          By accessing and using our services, you agree to be bound by these
          terms and conditions.
        </Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={styles.bold}>Important:</Text> Please read these terms
            carefully before using our services.
          </Text>
        </View>

        <Text style={styles.subHeader}>Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By creating an account or using our services, you acknowledge that you
          have read, understood, and agree to these terms.
        </Text>

        <Text style={styles.subHeader}>User Responsibilities</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Provide accurate and current information
          </Text>
          <Text style={styles.bulletPoint}>• Maintain account security</Text>
          <Text style={styles.bulletPoint}>
            • Use services lawfully and ethically
          </Text>
          <Text style={styles.bulletPoint}>
            • Respect other users and content
          </Text>
          <Text style={styles.bulletPoint}>
            • Report any unauthorized use immediately
          </Text>
        </View>

        <Text style={styles.subHeader}>Prohibited Activities</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Using our services for illegal purposes
          </Text>
          <Text style={styles.bulletPoint}>
            • Attempting to breach our security features
          </Text>
          <Text style={styles.bulletPoint}>
            • Disrupting or interfering with the platform
          </Text>
          <Text style={styles.bulletPoint}>• Spamming or impersonation</Text>
        </View>

        <Text style={styles.subHeader}>Changes to These Terms</Text>
        <Text style={styles.paragraph}>
          We may update these terms from time to time. Continued use of our
          services means you accept any changes.
        </Text>

        <Text style={styles.subHeader}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions or concerns about these terms, please contact us
          at support@example.com.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
    paddingTop: 20,
  },
  headerContainer: {
    height: 90,
    backgroundColor: AppColors.background_one,
    borderBottomWidth: .5,
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
    paddingBottom: 40,
  },
  lastUpdated: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    color: "#334155",
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    fontFamily: Fonts.body,
  },
  subHeader: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 6,
    color: AppColors.text_one,
    fontFamily: Fonts.bodyBold,
  },
  paragraph: {
    fontSize: 14,
    color: AppColors.text_two,
    lineHeight: 22,
    fontFamily: Fonts.body,
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  warningText: {
    fontSize: 14,
    color: "#92400e",
    fontFamily: Fonts.body,
  },
  bold: {
    fontWeight: "bold",
    fontFamily: Fonts.bodyBold,
  },
  bulletContainer: {
    marginTop: 8,
    paddingLeft: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 5,
    lineHeight: 22,
    fontFamily: Fonts.body,
  },
});
