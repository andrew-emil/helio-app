import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { PAGES_CONTENT } from "@/constants/pagesContants";
import { useTheme } from "@/context/themeContext";
import {
    Entypo,
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

// Enable animation for Android
if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface FaqItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FaqItem = ({ question, answer, isOpen, onClick }: FaqItemProps) => {
    const { colors } = useTheme()
    return (
        <View className="border rounded-xl mb-3" style={{ borderColor: "#e2e8f0" }}>
            <TouchableOpacity
                onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    onClick();
                }}
                className="flex-row justify-between items-center p-4"
            >
                <Text
                    className="flex-1 text-lg"
                    style={{
                        fontFamily: FONTS_CONSTANTS.semiBold,
                        color: colors.text
                    }}
                >
                    {question}
                </Text>
                <MaterialIcons
                    name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={22}
                    color="#008080"
                />
            </TouchableOpacity>
            {isOpen && (
                <View className="px-4 pb-4">
                    <Text
                        style={{
                            fontFamily: FONTS_CONSTANTS.regular,
                            color: "#6B7280",
                            lineHeight: 24,
                        }}
                    >
                        {answer}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default function FaqScreen() {
    const { colors } = useTheme();

    const content = PAGES_CONTENT.faq

    const [openFaqId, setOpenFaqId] = useState<string | null>("c0-i0");

    const getCategoryIcon = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes("تطبيق")) return <Ionicons name="information-circle" size={22} color={colors.primary} />;
        if (lower.includes("استخدام")) return <Feather name="settings" size={22} color={colors.primary} />;
        if (lower.includes("أماكن")) return <Entypo name="location-pin" size={22} color={colors.primary} />;
        if (lower.includes("تواصل")) return <FontAwesome5 name="comments" size={22} color={colors.primary} />;
        if (lower.includes("تطوير")) return <Ionicons name="rocket-outline" size={22} color={colors.primary} />;
        return <Feather name="help-circle" size={22} color={colors.primary} />;
    };

    return (
        <ScrollView
            className="flex-1 px-5 py-10"
            style={{ backgroundColor: colors.background }}
            showsVerticalScrollIndicator={false}
        >

            {/* Banner */}
            <View
                className="rounded-3xl p-6 mb-8"
                style={{ backgroundColor: colors.surface }}
            >
                <View className="items-center mb-5">
                    <Feather name="help-circle" size={48} color={colors.primary} />
                </View>
                <Text
                    className="text-center text-3xl mb-3"
                    style={{
                        fontFamily: FONTS_CONSTANTS.bold,
                        color: colors.text,
                    }}
                >
                    {content.title}
                </Text>
                <Text
                    className="text-center text-lg"
                    style={{
                        color: colors.muted,
                        fontFamily: FONTS_CONSTANTS.regular,
                    }}
                >
                    {content.subtitle}
                </Text>
            </View>

            {/* FAQ List */}
            <View
                className="rounded-3xl p-6"
                style={{ backgroundColor: colors.surface }}
            >
                {content.categories.map((category, catIndex) => (
                    <View key={catIndex} className="mb-8">
                        <View className="flex-row items-center mb-3">
                            {getCategoryIcon(category.category)}
                            <Text
                                className="text-2xl ml-2"
                                style={{
                                    fontFamily: FONTS_CONSTANTS.bold,
                                    color: colors.primary,
                                }}
                            >
                                {category.category}
                            </Text>
                        </View>
                        {category.items.map((item, itemIndex) => {
                            const id = `c${catIndex}-i${itemIndex}`;
                            return (
                                <FaqItem
                                    key={id}
                                    question={item.q}
                                    answer={item.a}
                                    isOpen={openFaqId === id}
                                    onClick={() => setOpenFaqId(openFaqId === id ? null : id)}
                                />
                            );
                        })}
                    </View>
                ))}

                {/* Footer */}
                <View
                    className="mt-10 rounded-xl p-6"
                    style={{ backgroundColor: colors.headerColor }}
                >
                    <Text
                        className="text-center text-xl"
                        style={{
                            fontFamily: FONTS_CONSTANTS.bold,
                            color: colors.text,
                        }}
                    >
                        ☀️ مدينتك في جيبك = Helio APP
                    </Text>
                    <Text
                        className="text-center mt-2"
                        style={{
                            fontFamily: FONTS_CONSTANTS.regular,
                            color: colors.muted,
                        }}
                    >
                        كل الأماكن، كل الخدمات، كل التفاصيل... في تطبيق واحد. جربه دلوقتي، وخلي المدينة أسهل.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
