import { DrawerSeparator } from "@/components/drawerSeparator";
import UserAvatar from "@/components/userAvatar";
import { drawerSections } from "@/constants/drawerConstants";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

function CustomDrawerContent(props: any) {
    const { colors, themeMode } = useTheme();
    const { logout, user } = useUser();
    const router = useRouter();
    const { navigation, state } = props;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingBottom: 0 }}>
                {/* Profile Section */}
                {user ? (
                    <View style={{ paddingVertical: 20, alignItems: "center" }}>
                        <UserAvatar />
                        <Text style={{ fontSize: 16, fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}>
                            {user.username}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            router.push("/profile");
                            navigation.closeDrawer();
                        }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: colors.primary,
                                    fontFamily: FONTS_CONSTANTS.medium,
                                    marginTop: 2,
                                }}
                            >
                                عرض الملف الشخصي
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="flex flex-row justify-center items-center m-3 gap-4">
                        <TouchableOpacity
                            onPress={() => {
                                router.push("/(auth)/login");
                                navigation.closeDrawer();
                            }}
                            className="text-center px-4 py-2 bg-cyan-500 text-white rounded-lg"
                        >
                            <Text style={{ fontFamily: FONTS_CONSTANTS.semiBold, marginLeft: 6 }}>
                                تسجيل الدخول
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                router.push("/(auth)/register");
                                navigation.closeDrawer();
                            }}
                            className="text-center px-4 py-2 bg-slate-200 rounded-lg"
                        >
                            <Text style={{ fontFamily: FONTS_CONSTANTS.semiBold, marginLeft: 6 }}>
                                إنشاء حساب
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <DrawerSeparator color={colors.surface} />

                {/* Drawer sections */}
                {drawerSections.map((section, sectionIndex) => (
                    <View key={sectionIndex}>
                        {section.map((item) => {
                            const isFocused =
                                state?.routes?.[state.index]?.name === item.name;
                            const activeColor =
                                themeMode === "light" ? "#1d4ed8" : "#3b82f6";

                            return (
                                <DrawerItem
                                    key={item.name}
                                    label={item.label}
                                    icon={() =>
                                        typeof item.icon === "function"
                                            ? item.icon({
                                                color: isFocused ? activeColor : colors.text,
                                            })
                                            : item.icon
                                    }
                                    focused={isFocused}
                                    activeTintColor={activeColor}
                                    inactiveTintColor={colors.text}
                                    labelStyle={{
                                        color: isFocused ? activeColor : colors.text,
                                        fontFamily: FONTS_CONSTANTS.medium,
                                    }}
                                    onPress={() => {
                                        navigation.navigate(item.name);
                                        navigation.closeDrawer(); // 👈 closes drawer after navigation
                                    }}
                                />
                            );
                        })}

                        {sectionIndex < drawerSections.length - 1 && (
                            <DrawerSeparator color={colors.surface} />
                        )}
                    </View>
                ))}
            </DrawerContentScrollView>

            {/* Footer */}
            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderTopColor: colors.surface,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        router.push("/privacy");
                        navigation.closeDrawer();
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 6,
                    }}
                >
                    <Ionicons name="book-outline" size={18} color={colors.text} />
                    <Text
                        style={{
                            marginLeft: 8,
                            color: colors.text,
                            fontFamily: FONTS_CONSTANTS.medium,
                        }}
                    >
                        سياسة الخصوصية
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        router.push("/terms");
                        navigation.closeDrawer();
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 6,
                    }}
                >
                    <Ionicons name="document-text-outline" size={18} color={colors.text} />
                    <Text
                        style={{
                            marginLeft: 8,
                            color: colors.text,
                            fontFamily: FONTS_CONSTANTS.medium,
                        }}
                    >
                        شروط الاستخدام
                    </Text>
                </TouchableOpacity>

                {user && (
                    <TouchableOpacity
                        onPress={() => {
                            logout();
                            navigation.closeDrawer();
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor: colors.accent,
                            marginTop: 10,
                        }}
                    >
                        <Ionicons name="log-out-outline" size={18} color={colors.text} />
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: FONTS_CONSTANTS.medium,
                                marginLeft: 6,
                            }}
                        >
                            تسجيل الخروج
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

export default CustomDrawerContent;
