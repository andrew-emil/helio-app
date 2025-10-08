import PageBanner from "@/components/pageBanner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { PAGES_CONTENT } from "@/constants/pagesContants";
import { useTheme } from "@/context/themeContext";
import { parseBoldSegments } from "@/utils/propertyUtils";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Privacy() {
    const { colors } = useTheme()
    const content = PAGES_CONTENT.privacy

    const getSectionIcon = (title: string) => {
        const lower = (title || "").toLowerCase();
        if (lower.includes("أمن") || lower.includes("security")) {
            return <Ionicons name="shield-checkmark-outline" size={22} color="#06b6d4" />;
        }
        if (lower.includes("حقوقك") || lower.includes("rights")) {
            return <Ionicons name="key-outline" size={22} color="#06b6d4" />;
        }
        if (lower.includes("أطفال") || lower.includes("children")) {
            return <Ionicons name="people-outline" size={22} color="#06b6d4" />;
        }
        if (lower.includes("روابط") || lower.includes("links")) {
            return <Ionicons name="link-outline" size={22} color="#06b6d4" />;
        }
        if (lower.includes("اتصل") || lower.includes("contact")) {
            return <Ionicons name="call-outline" size={22} color="#06b6d4" />;
        }
        return <Ionicons name="book-outline" size={22} color="#06b6d4" />;
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
                    title={content.title}
                    subtitle={`آخر تحديث: ${content.lastUpdated}`}
                    icon={<Ionicons name="shield-checkmark" size={40} color="#06b6d4" />}
                />
                <View className=" p-4 rounded-2xl shadow-lg mt-5"
                    style={{ backgroundColor: colors.surface }}
                >
                    {content.sections.map((section: any, index: number) => (
                        <View
                            key={index}
                            className="border-b last:border-b-0 pb-4 mb-6"
                            style={{ borderColor: colors.border }}
                        >
                            <View className="flex-row items-center mb-3">
                                <View className="mr-3">{getSectionIcon(section.title)}</View>
                                <Text className="text-2xl"
                                    style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                                >
                                    {section.title}
                                </Text>
                            </View>

                            <View>
                                {section.content.map((item: any, itemIndex: number) => {
                                    if (typeof item === "string") {
                                        const segments = parseBoldSegments(item);
                                        return (
                                            <Text
                                                key={itemIndex}
                                                style={[styles.paragraph, { fontFamily: FONTS_CONSTANTS.regular, color: colors.iconColor }]}
                                                className=" mb-3"
                                            >
                                                {segments.map((seg, si) =>
                                                    seg.bold ? (
                                                        <Text key={si} style={styles.bold}>
                                                            {seg.text}
                                                        </Text>
                                                    ) : (
                                                        <Text key={si} style={{ fontFamily: FONTS_CONSTANTS.regular }}>{seg.text}</Text>
                                                    )
                                                )}
                                            </Text>
                                        );
                                    } else if (item.list && Array.isArray(item.list)) {
                                        return (
                                            <View key={itemIndex} className="mb-3">
                                                {item.list.map((li: string, liIndex: number) => (
                                                    <View key={liIndex} className="flex-row items-start mb-1">
                                                        <Text className=" mr-2"
                                                            style={{ color: colors.iconColor }}
                                                        >•</Text>
                                                        <Text
                                                            className=" flex-1"
                                                            style={{ color: colors.iconColor, fontFamily: FONTS_CONSTANTS.regular }}
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
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    paragraph: {
        lineHeight: 22,
        fontSize: 15,
    },
    bold: {
        fontFamily: FONTS_CONSTANTS.bold
    },
});