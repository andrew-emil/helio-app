import CustomHeaderTitle from "@/components/CustomHeaderTitle";
import NotificationBadge from "@/components/notification/NotificationBadge";
import ThemeToggleButton from "@/components/themeToggleButton";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs, useRouter } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
    const { colors, themeMode } = useTheme();
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <DrawerToggleButton tintColor={colors.text} />,
                headerRight: () => (
                    <View className='flex flex-row items-center'>
                        <NotificationBadge
                            onPress={() => router.push('/(drawer)/notification')}
                            size="small"
                            showCount={true}
                        />
                        <ThemeToggleButton />
                    </View>
                ),
                headerTitleStyle: {
                    fontSize: 20,
                    fontFamily: FONTS_CONSTANTS.bold,
                    color: colors.text,
                    letterSpacing: 0.3,
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                },
                headerTitleContainerStyle: { left: 0, right: 0 },

                tabBarActiveTintColor: themeMode === "light" ? "#1d4ed8" : "#3b82f6",
                tabBarInactiveTintColor: colors.iconColor,
                tabBarStyle: {
                    backgroundColor: colors.headerColor,
                    borderTopColor: colors.surface,
                    borderTopWidth: 1,
                    height: 70,
                    paddingVertical: 5,
                    flexDirection: "row-reverse",

                    // shadow (iOS)
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,

                    // shadow (Android)
                    elevation: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontFamily: FONTS_CONSTANTS.medium,
                    letterSpacing: 0.3,
                    marginTop: 2,
                },

                headerStyle: {
                    backgroundColor: colors.headerColor,
                    borderBottomColor: colors.surface,
                    borderBottomWidth: 1,
                    // make header flat on Android
                    elevation: 0,
                    // if you want shadow on iOS:
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    height: 90,
                },

                tabBarIconStyle: {
                    marginBottom: -2,
                },

                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                tabBarAllowFontScaling: true,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "الرئيسية",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <CustomHeaderTitle />
                    ),
                }}
            />

            <Tabs.Screen
                name="emergency"
                options={{
                    title: "الطوارئ",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="alert" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: "الخدمات",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="realState"
                options={{
                    title: "العقارات",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="business" size={size} color={color} />
                    ),
                }}
            />

        </Tabs>
    );
}