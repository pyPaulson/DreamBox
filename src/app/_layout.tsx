// app/_layout.tsx
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Lora-Regular": require("@/assets/fonts/Lora-Regular.ttf"),
    "Lora-Bold": require("@/assets/fonts/Lora-Bold.ttf"),
    "Lora-SemiBold": require("@/assets/fonts/Lora-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // hide splash when fonts are ready
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // could show a loading indicator here
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
