import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Lora-Regular": require("@/assets/fonts/Lora-Regular.ttf"),
    "Lora-Bold": require("@/assets/fonts/Lora-Bold.ttf"),
    "Lora-SemiBold": require("@/assets/fonts/Lora-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
