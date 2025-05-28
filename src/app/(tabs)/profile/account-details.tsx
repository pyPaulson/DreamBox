// AccountDetailsScreen.tsx
import InfoCard from "@/components/InfoCard";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

const AccountDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Account Details</Text>

      <InfoCard label="First Name" value="Paulson" />
      <InfoCard label="Last Name" value="Gray" />
      <InfoCard
        label="Email"
        value="paulson@gmail.com"
        isEditable
        onPress={() => {
          console.log("Edit email");
        }}
      />
      <InfoCard label="Phone number" value="0557337520" />
      <InfoCard label="Date of birth" value="15 March 1990" />
      <InfoCard
        label="Update Password"
        value=""
        isEditable
        onPress={() => {
          console.log("Update password");
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_one,
  },
  header: {
    fontSize: 20,
    color: AppColors.primary,
    marginVertical: 20,
    alignSelf: "center",
    fontFamily: Fonts.bodyBold,
    marginBottom: 30,
  },
});

export default AccountDetailsScreen;
