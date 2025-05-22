import { StyleSheet, Text, View, Image, } from "react-native";
import React from "react";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SettingCard from "@/components/SettingsCard";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import ToggleSwitch from "@/components/ToggleSwitch";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topSec}>
        <Text style={styles.header}>Profile</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>User User</Text>
        <Text style={styles.phone}>0557337520</Text>
      </View>
      <View style={styles.bottomSec}>
        <SettingCard
          icon={<MaterialIcons name="person" size={22} color="#023e8a" />}
          label="Account Details"
        />
        <SettingCard
          icon={<FontAwesome5 name="id-card" size={20} color="#023e8a" />}
          label="KYC"
        />
        <SettingCard
          icon={<Feather name="bell" size={20} color="#023e8a" />}
          label="Notifications"
          rightElement={<ToggleSwitch />}
        />
        <SettingCard
          icon={<Feather name="file-text" size={20} color="#023e8a" />}
          label="Account Statement"
        />
        <SettingCard
          icon={<MaterialIcons name="security" size={20} color="#023e8a" />}
          label="Security"
        />
        <SettingCard
          icon={<Feather name="moon" size={20} color="#023e8a" />}
          label="Enable dark mode"
          rightElement={<ToggleSwitch />}
        />
        <SettingCard
          icon={<MaterialIcons name="privacy-tip" size={20} color="#023e8a" />}
          label="Privacy Policy"
        />
        <SettingCard
          icon={<MaterialIcons name="logout" size={20} color="red" />}
          label="Log out"
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
    flex: 1.2,
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    color: AppColors.text_three,
    fontSize: 23,
    fontFamily: Fonts.bodyBold,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 10,
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
