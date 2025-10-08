import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { PAGES_CONTENT } from "@/constants/pagesContants";
import { useTheme } from "@/context/themeContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
    const { colors } = useTheme();
    const content = PAGES_CONTENT.about


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
                {/* Card Container */}
                <View
                    className="rounded-3xl shadow-lg p-6"
                    style={{ backgroundColor: colors.surface }}
                >
                    {/* Icon */}
                    <View className="flex justify-center items-center mb-6">
                        <View
                            className="p-4 rounded-full"
                            style={{ backgroundColor: colors.primary + "20" }}
                        >
                            <FontAwesome name="cube" size={48} color={colors.primary} />
                        </View>
                    </View>

                    {/* Title */}
                    <Text
                        className="text-center text-3xl mb-4"
                        style={{
                            color: colors.text,
                            fontFamily: FONTS_CONSTANTS.bold,
                        }}
                    >
                        {content.title}
                    </Text>

                    {/* Intro */}
                    <Text
                        className="text-center text-lg mb-8 leading-relaxed"
                        style={{
                            color: colors.muted,
                            fontFamily: FONTS_CONSTANTS.regular,
                        }}
                    >
                        {content.intro}
                    </Text>

                    {/* Vision and Mission */}
                    <View className="gap-6">
                        <View
                            className="rounded-xl p-5"
                            style={{ backgroundColor: colors.headerColor }}
                        >
                            <Text
                                className="text-2xl mb-3"
                                style={{
                                    color: colors.primary,
                                    fontFamily: FONTS_CONSTANTS.semiBold,
                                }}
                            >
                                {content.vision.title}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: FONTS_CONSTANTS.regular,
                                }}
                            >
                                {content.vision.text}
                            </Text>
                        </View>

                        <View
                            className="rounded-xl p-5"
                            style={{ backgroundColor: colors.headerColor }}
                        >
                            <Text
                                className="text-2xl mb-3"
                                style={{
                                    color: colors.primary,
                                    fontFamily: FONTS_CONSTANTS.semiBold,
                                }}
                            >
                                {content.mission.title}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: FONTS_CONSTANTS.regular,
                                }}
                            >
                                {content.mission.text}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}