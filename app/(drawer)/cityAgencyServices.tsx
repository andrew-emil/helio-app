import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { getAllCityAgency } from "@/services/firebase/cityAgency";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CityAgencyServices() {
    const { colors } = useTheme();
    const { data: cityAgencies = [], isLoading, error } = useQuery({
        queryKey: ["city-agency"],
        queryFn: async () => await getAllCityAgency(),
    });
    const [openId, setOpenId] = useState<string | null>(
        cityAgencies.length > 0 ? cityAgencies[0].id : null
    );

    if (isLoading) return <Spinner />;
    if (error) return <ErrorFallback />;


    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <SafeAreaView
            className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}
        >
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
            >
                <PageBanner
                    title="خدمات جهاز المدينة"
                    subtitle="خطوات واضحة ومستندات مطلوبة لإنجاز معاملاتك بسهولة."
                    icon={<Feather name="file-text" size={48} color="#06b6d4" />}
                />

                {cityAgencies.map((guide) => (
                    <View
                        key={guide.id}
                        className="my-4 rounded-xl overflow-hidden border"
                        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                    >
                        <TouchableOpacity
                            onPress={() => handleToggle(guide.id)}
                            className="flex-row justify-between items-center p-4"
                        >
                            <Text className="text-lg"
                                style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                            >
                                {guide.title}
                            </Text>

                            <View className="flex-row items-center">
                                <MaterialIcons
                                    name={
                                        openId === guide.id
                                            ? "keyboard-arrow-up"
                                            : "keyboard-arrow-down"
                                    }
                                    size={24}
                                    color="#94a3b8"
                                />
                            </View>
                        </TouchableOpacity>

                        {openId === guide.id && (
                            <View className="p-4 border-t border-slate-700">
                                {/* Steps */}
                                <View className="mb-4">
                                    <Text className="text-cyan-400 mb-2"
                                        style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                                    >
                                        خطوات التقديم:
                                    </Text>
                                    {guide.stepsToApply.map((step, i) => (
                                        <Text
                                            key={i}
                                            className="mb-1 leading-relaxed"
                                            style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                                        >
                                            {i + 1} - {step}
                                        </Text>
                                    ))}
                                </View>

                                {/* Documents */}
                                <View>
                                    <Text className="text-cyan-400 mb-2"
                                        style={{ fontFamily: FONTS_CONSTANTS.semiBold }}>
                                        الأوراق المطلوبة:
                                    </Text>
                                    {guide.requiredDocs.map((doc, i) => (
                                        <Text
                                            key={i}
                                            className="mb-1 leading-relaxed"
                                            style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                                        >
                                            {i + 1} - {doc}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
