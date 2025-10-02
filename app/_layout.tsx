import { ThemeProvider, useTheme } from "@/context/themeContext";
import { UserProvider } from "@/context/userContext";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CommunityProvider } from "@/context/communityContext";
import { DataProvider } from "@/context/dataContext";
import { ToastProvider } from "@/context/toastContext";

import "@/styles/globals.css";
import "react-native-gesture-handler";
import "react-native-reanimated";

import React, { useCallback, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

/**
 * Configure foreground notification behavior
 * (show alert, play sound, set badge)
 */
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

  // typed refs for subscriptions
  const responseSubscriptionRef = useRef<Notifications.Subscription | null>(null);
  const receivedSubscriptionRef = useRef<Notifications.Subscription | null>(null);

  // handle navigation from notification response
  const handleNotificationNavigation = useCallback(
    (response: Notifications.NotificationResponse) => {
      try {
        // data can be an empty object; type-guard before using string methods
        const data = response?.notification?.request?.content?.data as
          | Record<string, unknown>
          | undefined;

        if (data && typeof data.screen === "string") {
          const screen = data.screen;

          if (screen === "News" && data.newsId != null) {
            // If you use a dynamic route app/news/[newsId].tsx, push string route:
            // casting to `any` because expo-router type unions are strict at compile time
            const newsId = String(data.newsId);
            router.push((`/news/${encodeURIComponent(newsId)}` as unknown) as any);
            return;
          }

          // fallback for other named screens — convert to lowercase safely
          router.push((`/${screen.toLowerCase()}` as unknown) as any);
          return;
        }

        // fallback to home
        router.push((`/` as unknown) as any);
      } catch (err) {
        console.error("Navigation from notification failed:", err);
      }
    },
    [router]
  );

  useEffect(() => {
    // request permission and log FCM token (for debugging)
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

    // foreground receive
    receivedSubscriptionRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received (foreground):", notification);
      }
    );

    // when user taps the notification (background/foreground)
    responseSubscriptionRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationNavigation(response);
      });

    // if the app was killed and opened by tapping a notification
    (async () => {
      try {
        const lastResponse = await Notifications.getLastNotificationResponseAsync();
        if (lastResponse) {
          // slight delay to let routing mount
          setTimeout(() => handleNotificationNavigation(lastResponse), 50);
        }
      } catch (e) {
        console.error("Error checking last notification response:", e);
      }
    })();

    return () => {
      // cleanup
      responseSubscriptionRef.current?.remove();
      receivedSubscriptionRef.current?.remove();
    };
    // include handleNotificationNavigation to satisfy exhaustive-deps
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