import CustomDrawerContent from "@/components/customDrawerContent";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";

export default function AppLayout() {
    const { colors, themeMode } = useTheme();
    const router = useRouter()

    return (
        <>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: colors.headerColor,
                    },
                    drawerLabelStyle: {
                        color: colors.text,
                        fontFamily: FONTS_CONSTANTS.medium
                    },
                    drawerActiveTintColor: themeMode === "light" ? "#1d4ed8" : "#3b82f6",
                    drawerInactiveTintColor: colors.text,

                    headerTitleStyle: {
                        fontSize: 20,
                        fontFamily: FONTS_CONSTANTS.bold,
                        color: colors.text,
                        letterSpacing: 0.3,
                    },
                    headerTitleContainerStyle: { left: 0, right: 0 },
                    headerStyle: {
                        backgroundColor: colors.headerColor,
                        borderBottomColor: colors.surface,
                        borderBottomWidth: 1,

                        elevation: 0,

                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 4,
                        height: 90,
                    },
                    headerTitleAlign: "center",
                    headerLeft: () => <DrawerToggleButton tintColor={colors.text} />,

                    headerRight: () => <TouchableOpacity
                        className="flex mr-3"
                        onPress={() => router.back()}
                    >
                        <Ionicons name='arrow-back' size={24} color={colors.text} />
                    </TouchableOpacity>
                }}
            >
                {/* Tabs group */}
                <Drawer.Screen
                    name="tabs"
                    options={{
                        drawerItemStyle: { display: 'none' },
                        title: undefined,
                        headerShown: false,
                    }}
                />

                <Drawer.Screen
                    name="home"
                    options={{
                        title: "الرئيسية",
                        drawerLabel: "الرئيسية",
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="favorites"
                    options={{
                        drawerLabel: "المفضلة",
                        title: "المفضلة",
                        drawerIcon: () => (
                            <Ionicons name="heart-outline" size={22} color="red" />
                        ),
                    }}
                />


                <Drawer.Screen
                    name="news"
                    options={{
                        drawerLabel: "الأخبار",
                        title: "الأخبار",
                        drawerIcon: () => (
                            <Ionicons name="newspaper-outline" size={22} color="#2F3868" />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="community"
                    options={{
                        drawerLabel: "المجتمع",
                        title: "المجتمع",
                        drawerIcon: () => (
                            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#1C384B" />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="market"
                    options={{
                        drawerLabel: "البيع و الشراء",
                        title: "البيع و الشراء",
                        drawerIcon: () => (
                            <FontAwesome name="shopping-bag" size={22} color="yellow" />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="jobs"
                    options={{
                        drawerLabel: "الوظائف",
                        title: "الوظائف",
                        drawerIcon: () => (
                            <Ionicons name="briefcase-outline" size={22} color="#84CC16" />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="buses"
                    options={{
                        drawerLabel: "المواصلات",
                        title: "المواصلات",
                        drawerIcon: () => (
                            <FontAwesome6 name="truck" size={22} color="#5F4892" />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="cityAgencyServices"
                    options={{
                        drawerLabel: "خدمات جهاز المدينة",
                        title: "خدمات جهاز المدينة",
                        drawerIcon: () => (
                            <Ionicons name="documents-outline" size={22} color="#0EA5E9" />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="aboutCity"
                    options={{
                        drawerLabel: "عن المدينة و الشركة",
                        title: "عن المدينة و الشركة",
                        drawerIcon: () => (
                            <FontAwesome6 name="building-columns" size={22} color="#22C55E" />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="profile"
                    options={{
                        drawerItemStyle: { display: 'none' },
                        title: "البروفايل",
                        headerShown: true,
                    }}
                />

                <Drawer.Screen
                    name="news/[newsId]"
                    options={{
                        drawerLabelStyle: { display: 'none' },
                        title: "اﻻخبار",
                        headerShown: true,
                        headerRight: () => <TouchableOpacity
                            className="flex mr-3"
                            onPress={() => router.push('/(drawer)/news')}
                        >
                            <Ionicons name='arrow-back' size={24} color={colors.text} />
                        </TouchableOpacity>
                    }}
                />

                <Drawer.Screen
                    name="property/[propertyId]"
                    options={{
                        drawerLabelStyle: { display: 'none' },
                        title: "العقارات",
                        headerShown: true,
                        headerRight: () => <TouchableOpacity
                            className="flex mr-3"
                            onPress={() => router.push('/(drawer)/tabs/realState')}
                        >
                            <Ionicons name='arrow-back' size={24} color={colors.text} />
                        </TouchableOpacity>
                    }}
                />

                <Drawer.Screen
                    name="category/[categoryName]"
                    options={{
                        drawerLabelStyle: { display: 'none' },
                        title: "الخدمات",
                        headerShown: true,
                        headerRight: () => <TouchableOpacity
                            className="flex mr-3"
                            onPress={() => router.push('/(drawer)/tabs/services')}
                        >
                            <Ionicons name='arrow-back' size={24} color={colors.text} />
                        </TouchableOpacity>
                    }}
                />

                <Drawer.Screen
                    name="category/service/[serviceId]"
                    options={{
                        drawerLabelStyle: { display: 'none' },
                        title: "الخدمات",
                        headerShown: true,
                        headerRight: () => <TouchableOpacity
                            className="flex mr-3"
                            onPress={() => router.back()}
                        >
                            <Ionicons name='arrow-back' size={24} color={colors.text} />
                        </TouchableOpacity>
                    }}
                />

                <Drawer.Screen
                    name="about"
                    options={{
                        drawerLabel: "من نحن",
                        title: "من نحن",
                        drawerIcon: ({ color }) => (
                            <Ionicons name="information-circle" size={22} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="Contact"
                    options={{
                        drawerLabel: "اتصل بنا",
                        title: "اتصل بنا",
                        drawerIcon: ({ color }) => (
                            <Ionicons name="call" size={22} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="faq"
                    options={{
                        drawerLabel: "الأسئلة الشائعة",
                        title: "الأسئلة الشائعة",
                        drawerIcon: ({ color }) => (
                            <Ionicons name="help-circle" size={22} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="notification"
                    options={{
                        drawerItemStyle: { display: 'none' },
                        title: undefined,
                        headerShown: true,
                    }}
                />

            </Drawer>
            {/* <WhatsAppFab /> */}
        </>
    );
}