import PageBanner from "@/components/pageBanner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { PAGES_CONTENT } from "@/constants/pagesContants";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Terms() {
    const { colors } = useTheme();
    const terms = PAGES_CONTENT.terms

    const getSectionIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes("ملكية") || t.includes("intellectual"))
            return <Ionicons name="key-outline" size={22} color={colors.primary} />;
        if (t.includes("محظور") || t.includes("prohibited"))
            return <Ionicons name="ban-outline" size={22} color={colors.primary} />;
        if (t.includes("قانون") || t.includes("law"))
            return <Ionicons name="scale-outline" size={22} color={colors.primary} />;
        if (t.includes("حساب") || t.includes("account"))
            return (
                <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
            );
        if (t.includes("اتصل") || t.includes("contact"))
            return <Ionicons name="call-outline" size={22} color={colors.primary} />;
        return <Ionicons name="document-text-outline" size={22} color={colors.primary} />;
    };

    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
            >
                <PageBanner
                    title={terms.title}
                    subtitle={`آخر تحديث: ${terms.lastUpdated}`}
                    icon={<Ionicons name="document-text-outline" size={40} color="#06b6d4" />}
                />

                <View className=" p-4 rounded-2xl shadow-lg mt-5"
                    style={{ backgroundColor: colors.surface }}
                >
                    {terms.sections.map((section, index) => (
                        <View
                            key={index}
                            className="mb-6 pb-6 border-b"
                            style={{ borderColor: colors.border }}
                        >
                            <View className="flex-row items-center mb-3">
                                {getSectionIcon(section.title)}
                                <Text
                                    className="ml-2 text-lg"
                                    style={{
                                        fontFamily: FONTS_CONSTANTS.bold,
                                        color: colors.text,
                                    }}
                                >
                                    {section.title}
                                </Text>
                            </View>

                            {section.content.map((item, itemIndex) => {
                                if (typeof item === "string") {
                                    return (
                                        <Text
                                            key={itemIndex}
                                            style={{
                                                fontFamily: FONTS_CONSTANTS.regular,
                                                color: colors.muted,
                                                fontSize: 15,
                                                lineHeight: 24,
                                                marginBottom: 8,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    );
                                } else if (item.list) {
                                    return (
                                        <View key={itemIndex} className="mb-3">
                                            {item.list.map((li: string, liIndex: number) => (
                                                <View key={liIndex} className="flex-row items-start mb-2">
                                                    <Text
                                                        style={{
                                                            color: colors.primary,
                                                            marginRight: 6,
                                                            fontSize: 14,
                                                        }}
                                                    >
                                                        •
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontFamily: FONTS_CONSTANTS.regular,
                                                            color: colors.muted,
                                                            fontSize: 15,
                                                            lineHeight: 22,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {li}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                }
                                return null;
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}