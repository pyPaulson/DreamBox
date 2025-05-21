import { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import AppColors from "@/constants/AppColors";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login" as any); // Navigate to login screen
    }, 3000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/SplashLogo.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 500,
    resizeMode: "contain",
  },
});
