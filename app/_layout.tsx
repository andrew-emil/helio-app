
import { DataProvider } from "@/context/dataContext";
import { NotificationProvider } from "@/context/notificationsContext";
import { ThemeProvider, useTheme } from "@/context/themeContext";
import { ToastProvider } from "@/context/toastContext";
import { UserProvider } from "@/context/userContext";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nManager } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient()

I18nManager.allowRTL(true)
I18nManager.forceRTL(true)


function RootLayoutInner() {
  const { themeMode, colors } = useTheme();

  return (
    <>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <ThemeProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <UserProvider>
                <DataProvider>
                  <RootLayoutInner />
                </DataProvider>
              </UserProvider>
            </QueryClientProvider>
          </ToastProvider>
        </ThemeProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}
