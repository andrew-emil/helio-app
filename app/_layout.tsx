
import { CommunityProvider } from "@/context/communityContext";
import { DataProvider } from "@/context/dataContext";
import { ThemeProvider, useTheme } from "@/context/themeContext";
import { ToastProvider } from "@/context/toastContext";
import { UserProvider } from "@/context/userContext";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/styles/globals.css";
import "react-native-gesture-handler";
import "react-native-reanimated";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function RootLayoutInner() {
  const { themeMode, colors } = useTheme();
  const router = useRouter();

  const responseSubscriptionRef = useRef<Notifications.Subscription | null>(null);
  const receivedSubscriptionRef = useRef<Notifications.Subscription | null>(null);

  const handleNotificationNavigation = useCallback(
    (response: Notifications.NotificationResponse) => {
      try {

        const data = response?.notification?.request?.content?.data as
          | Record<string, unknown>
          | undefined;
        if (data && typeof data.screen === "string") {
          const screen = data.screen;
          if (screen === "News" && data.newsId != null) {

            const newsId = String(data.newsId);
            router.push((`/news/${encodeURIComponent(newsId)}` as unknown) as any);
            return;
          }
          router.push((`/${screen.toLowerCase()}` as unknown) as any);
          return;
        }

        router.push((`/` as unknown) as any);
      } catch (err) {
        console.error("Navigation from notification failed:", err);
      }
    },
    [router]
  );

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      try {
        if (!Device.isDevice) {
          console.warn("Push notifications require a physical device.");
          return;
        }
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Notification permission not granted!");
          return;
        }
        const tokenObj = await Notifications.getDevicePushTokenAsync();
        console.log("FCM token (device push token):", tokenObj?.data);
      } catch (err) {
        console.error("Failed to register for notifications:", err);
      }
    }
    registerForPushNotificationsAsync();

    receivedSubscriptionRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received (foreground):", notification);
      }
    );

    responseSubscriptionRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationNavigation(response);
      });

    (async () => {
      try {
        const lastResponse = await Notifications.getLastNotificationResponseAsync();
        if (lastResponse) {
          setTimeout(() => handleNotificationNavigation(lastResponse), 50);
        }
      } catch (e) {
        console.error("Error checking last notification response:", e);
      }
    })();
    return () => {
      responseSubscriptionRef.current?.remove();
      receivedSubscriptionRef.current?.remove();
    };
  }, [handleNotificationNavigation]);

  return (
    <>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(drawer)" />
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
              <DataProvider>
                <RootLayoutInner />
              </DataProvider>
            </CommunityProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
