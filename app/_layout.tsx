import { ThemeProvider, useTheme } from "@/context/themeContext";
import { UserProvider } from "@/context/userContext";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CommunityProvider } from "@/context/communityContext";
import { ToastProvider } from "@/context/toastContext";
import "@/styles/globals.css";
import "react-native-gesture-handler";
import "react-native-reanimated";

function RootLayoutInner() {
  const { themeMode, colors } = useTheme();

  return (
    <>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} backgroundColor={colors.background} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name='(drawer)' />
      </Stack>
    </>
  );
}

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <CommunityProvider>
              <RootLayoutInner />
            </CommunityProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}