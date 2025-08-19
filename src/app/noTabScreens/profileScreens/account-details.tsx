import InfoCard from "@/components/InfoCard";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "@/services/user";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
};

const AccountDetailsScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  console.log("User:", user);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Failed to load user</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Account Details</Text>

      <InfoCard label="First Name" value={user.first_name} />
      <InfoCard label="Last Name" value={user.last_name} />
      <InfoCard label="Email" value={user.email} />
      <InfoCard label="Phone number" value={user.phone_number} />
      <InfoCard
        label="Date of birth"
        value={moment(user.date_of_birth).format("D MMMM YYYY")}
      />
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
  backButton: {
    position: "absolute",
    top: 70,
    left: 27,
    zIndex: 10,
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
