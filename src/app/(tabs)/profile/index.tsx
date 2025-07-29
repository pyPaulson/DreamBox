import { StyleSheet, Text, View, Image, ActivityIndicator, Alert, } from "react-native";
import React, { useEffect, useState } from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SettingCard from "@/components/SettingsCard";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import ToggleSwitch from "@/components/ToggleSwitch";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "@/services/user";
import { logoutUser } from "@/services/auth";

type User = {
  first_name: string;
  last_name: string;
  phone_number: string;
};

const ProfileScreen = () => {
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

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            const success = await logoutUser();
            if (success) {
              await AsyncStorage.removeItem("accessToken");
              router.replace("/(auth)/login");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.topSec}>
        <Text style={styles.header}>Profile</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : user ? (
          <>
            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.phone}>{user.phone_number}</Text>
          </>
        ) : (
          <>
            <Text style={styles.name}>Unknown User</Text>
            <Text style={styles.phone}>N/A</Text>
          </>
        )}
      </View>
      <View style={styles.bottomSec}>
        <SettingCard
          icon={<MaterialIcons name="person" size={22} color="#023e8a" />}
          label="Account Details"
          onPress={() => {
            router.push("/noTabScreens/profileScreens/account-details");
          }}
        />
        <SettingCard
          icon={<FontAwesome5 name="wallet" size={20} color="#023e8a" />}
          label="Wallets"
          onPress={() => {
            router.push("/noTabScreens/profileScreens/wallets");
          }}
        />
        <SettingCard
          icon={<Feather name="bell" size={20} color="#023e8a" />}
          label="Notifications"
          rightElement={<ToggleSwitch />}
        />
        <SettingCard
          icon={<Feather name="file-text" size={20} color="#023e8a" />}
          label="Account Statement"
          onPress={() => {
            router.push("/noTabScreens/profileScreens/account-statement");
          }}
        />
        <SettingCard
          icon={<MaterialIcons name="security" size={20} color="#023e8a" />}
          label="Security"
          onPress={() => {
            router.push("/noTabScreens/profileScreens/security");
          }}
        />
        <SettingCard
          icon={<MaterialIcons name="menu-book" size={20} color="#023e8a" />}
          label="Terms and conditions"
          onPress={() => {
            router.push("/noTabScreens/profileScreens/terms-and-condition");
          }}
        />
        <SettingCard
          icon={<MaterialIcons name="privacy-tip" size={20} color="#023e8a" />}
          label="Privacy Policy"
          onPress={() => {
            router.push("/noTabScreens/profileScreens/privacy");
          }}
        />
        <SettingCard
          icon={<MaterialIcons name="logout" size={20} color="red" />}
          label="Log out"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  topSec: {
    flex: 1.6,
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    color: AppColors.text_three,
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  name: {
    marginTop: 13,
    color: AppColors.text_three,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  phone: {
    marginTop: 5,
    color: AppColors.text_three,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  bottomSec: {
    flex: 3.3,
    backgroundColor: AppColors.background_one,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
});
