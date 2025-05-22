import { Tabs } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppColors.primary,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: AppColors.background_one,
          borderTopWidth: .3,
          height: 100,
          paddingTop: 10,
          borderRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: Fonts.bodyBold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ size, color }) => {
            return <Octicons name="home" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="save"
        options={{
          tabBarLabel: "Save",
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="post-add" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",

          tabBarIcon: ({ size, color }) => {
            return <Ionicons name="book-outline" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
