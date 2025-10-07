import PageBanner from "@/components/pageBanner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useFormattedServices } from "@/hooks/useServiceFormatter";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Services() {
    const formattedServices = useFormattedServices();
    const { colors } = useTheme();
    const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
    const router = useRouter()

    // Enable LayoutAnimation on Android
    useEffect(() => {
        if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const handleToggleCategory = (categoryName: string) => {
        LayoutAnimation.configureNext({
            duration: 250,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            },
            delete: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
        });
        setOpenCategoryId((current) => (current === categoryName ? null : categoryName));
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Banner (removed icon) */}
                <PageBanner
                    title="الخدمات"
                    subtitle="اكتشف كل ما تقدمه مدينة هليوبوليس الجديدة."
                    icon={<Ionicons name="briefcase" size={32} color={colors.primary} />}
                />

                {/* Emergency Services Quick Access - simplified (no icons) */}
                <View className="px-6 mt-2 mb-6">
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.surface,
                            borderLeftWidth: 4,
                            borderLeftColor: colors.error,
                        }}
                        className="p-4 rounded-lg active:opacity-80"
                        onPress={() => {
                            // keep behavior placeholder if needed
                            console.log("Open emergency services");
                        }}
                    >
                        <View>
                            <Text
                                className="text-lg text-right"
                                style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.bold }}
                            >
                                خدمات الطوارئ
                            </Text>
                            <Text
                                className="text-sm text-right mt-1"
                                style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.regular }}
                            >
                                الأرقام والخدمات الأساسية
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Categories List */}
                <View className="px-6">
                    {formattedServices.length === 0 ? (
                        <View className="py-12 items-center">
                            <Text style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.regular }}>
                                لا توجد خدمات متاحة حالياً
                            </Text>
                        </View>
                    ) : (
                        formattedServices.map((category, index) => {
                            const isOpen = openCategoryId === category.categoryName;
                            return (
                                <View
                                    key={index}
                                    className="mb-4"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderRadius: 12,
                                        overflow: "hidden",
                                        borderWidth: 1,
                                        borderColor: colors.muted + "20",
                                    }}
                                >
                                    {/* Category Header */}
                                    <TouchableOpacity
                                        onPress={() => handleToggleCategory(category.categoryName)}
                                        className="flex-row justify-between items-center p-4 active:opacity-90"
                                        style={{
                                            backgroundColor: isOpen ? colors.primary + "10" : "transparent",
                                        }}
                                    >
                                        <View className="flex-1 text-right">
                                            <Text
                                                className="text-lg"
                                                style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.bold }}
                                            >
                                                {category.categoryName}
                                            </Text>
                                            <Text
                                                className="text-sm mt-1"
                                                style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.regular }}
                                            >
                                                {category.subCategories.length} أقسام
                                            </Text>
                                        </View>

                                        {/* Simple text indicator (no icon library) */}
                                        <View style={{ marginLeft: 12 }}>
                                            <Text
                                                style={{
                                                    fontFamily: FONTS_CONSTANTS.bold,
                                                    color: colors.primary,
                                                    fontSize: 18,
                                                }}
                                            >
                                                {isOpen ? "▲" : "▼"}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Subcategories (conditionally rendered to allow LayoutAnimation) */}
                                    {isOpen && (
                                        <View
                                            className="border-t"
                                            style={{
                                                borderTopColor: colors.muted + "20",
                                                padding: 16,
                                            }}
                                        >
                                            <View className="flex-row flex-wrap gap-3">
                                                {category.subCategories.map((subCategory) => (
                                                    <TouchableOpacity
                                                        key={subCategory.subCategoryName}
                                                        style={{
                                                            backgroundColor: colors.background,
                                                        }}
                                                        className="flex-1 min-w-[48%] p-3 rounded-lg active:opacity-70"
                                                        onPress={() => {
                                                            router.push(`/(drawer)/category/${subCategory.subCategoryName}`)
                                                        }}
                                                    >
                                                        <Text
                                                            className=" text-left text-sm mb-1"
                                                            style={{
                                                                color: colors.text,
                                                                fontFamily: FONTS_CONSTANTS.semiBold,
                                                            }}
                                                        >
                                                            {subCategory.subCategoryName}
                                                        </Text>
                                                        <Text
                                                            className="text-xs text-left"
                                                            style={{
                                                                color: colors.muted,
                                                                fontFamily: FONTS_CONSTANTS.regular,
                                                            }}
                                                        >
                                                            {subCategory.services.length} خدمة
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
