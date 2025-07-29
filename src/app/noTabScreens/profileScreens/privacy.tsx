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

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: July 29, 2025</Text>

        <Text style={styles.paragraph}>
          This Privacy Policy outlines how DreamBox collects, uses, protects,
          and shares your information when you use our mobile application and
          related services. By accessing or using DreamBox, you agree to the
          terms outlined in this policy.
        </Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={styles.bold}>Note:</Text> Your dreams, reflections, and
            emotional entries are treated with strict privacy and
            confidentiality.
          </Text>
        </View>

        <Text style={styles.subHeader}>1. Information We Collect</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Personal Information:</Text> Name,
            email, profile image (if provided), and optional demographic info.
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Dream Logs & Journal Entries:</Text> The
            dreams, thoughts, and notes you write in DreamBox are stored
            securely and are private by default.
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Emotional & Mood Data:</Text> Emotions
            you track or tag in entries help personalize your insights and
            analytics.
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Device Information:</Text> OS, device
            type, usage time, and crash logs to improve performance.
          </Text>
        </View>

        <Text style={styles.subHeader}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>DreamBox uses your data to:</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Provide and personalize your journaling and dream insight
            experience
          </Text>
          <Text style={styles.bulletPoint}>
            • Sync data securely across your devices
          </Text>
          <Text style={styles.bulletPoint}>
            • Deliver dream patterns, emotion analytics, and growth prompts
          </Text>
          <Text style={styles.bulletPoint}>
            • Improve app performance and fix bugs
          </Text>
          <Text style={styles.bulletPoint}>
            • Send optional motivation, reminders, and insights (you can turn
            these off anytime)
          </Text>
        </View>

        <Text style={styles.subHeader}>3. Data Security</Text>
        <Text style={styles.paragraph}>
          We use encryption and secure storage (including on-device secure
          stores) to protect your sensitive entries and personal data. All
          transmissions use HTTPS, and no dream content is shared without your
          consent.
        </Text>

        <Text style={styles.subHeader}>4. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          DreamBox does <Text style={styles.bold}>not sell</Text> or share your
          personal journal or dream content with any third party. Limited data
          may be shared with trusted partners only for:
        </Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Analytics (anonymous usage stats)
          </Text>
          <Text style={styles.bulletPoint}>
            • Cloud backup providers (encrypted only)
          </Text>
          <Text style={styles.bulletPoint}>
            • Legal compliance if required by law
          </Text>
        </View>

        <Text style={styles.subHeader}>5. Your Rights & Choices</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • You can request access to or deletion of your data at any time
          </Text>
          <Text style={styles.bulletPoint}>
            • You can update your profile and email settings
          </Text>
          <Text style={styles.bulletPoint}>
            • You can export your journal/dreams via the app settings
          </Text>
        </View>

        <Text style={styles.subHeader}>6. Third-Party Integrations</Text>
        <Text style={styles.paragraph}>
          If you choose to connect to third-party services (e.g., Apple Health,
          cloud sync), we only access data necessary to provide relevant
          functionality. No data is shared back without your permission.
        </Text>

        <Text style={styles.subHeader}>7. Children’s Privacy</Text>
        <Text style={styles.paragraph}>
          DreamBox is not intended for users under 13. We do not knowingly
          collect personal data from children.
        </Text>

        <Text style={styles.subHeader}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this policy from time to time. We'll notify you of major
          changes, and continued use of DreamBox implies acceptance of the
          latest version.
        </Text>

        <Text style={styles.subHeader}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions, feedback, or requests regarding this
          Privacy Policy or your data, contact us at:
        </Text>
        <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
          privacy@dreambox.app
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

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
