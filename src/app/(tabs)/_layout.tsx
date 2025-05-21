import { Tabs } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppColors from "@/constants/AppColors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: "#888",
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
          tabBarIcon: ({ size, color }) => {
            {
              return <MaterialIcons name="person" size={size} color={color} />;
            }
          },
        }}
      />
    </Tabs>
  );
}
