import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { getAllCityAgency } from "@/services/firebase/cityAgency";
import { CityAgencyDoc } from "@/types/firebaseDocs.type";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockServiceGuides: CityAgencyDoc[] = [
    {
        id: "1",
        title: "التقديم على عداد مياه",
        stepsToApply: [
            "تقديم طلب بالمركز التجاري لجهاز المدينة.",
            "سداد رسوم المعاينة والتوريد.",
            "إجراء المعاينة الفنية بواسطة الفني المختص.",
            "استلام العداد وتركيبه بعد استيفاء الشروط.",
        ],
        requiredDocs: [
            "صورة بطاقة الرقم القومي سارية.",
            "صورة عقد الملكية أو التخصيص.",
            "آخر إيصال سداد رسوم الصيانة.",
            "توكيل رسمي في حالة عدم حضور المالك.",
        ],
    },
    {
        id: "2",
        title: "التقديم على عداد كهرباء",
        stepsToApply: [
            "شراء كراسة الشروط من شركة الكهرباء.",
            "تقديم المستندات المطلوبة ودفع الرسوم.",
            "تحديد موعد للمعاينة الفنية.",
            "تركيب العداد بعد الموافقة.",
        ],
        requiredDocs: [
            "صورة بطاقة الرقم القومي.",
            "موافقة من جهاز المدينة.",
            "صورة رخصة البناء.",
        ],
    },
    {
        id: '3',
        title: "استخراج تصريح تشطيب",
        stepsToApply: [
            "تقديم طلب لإدارة التنمية بالجهاز.",
            "تحديد نوع التشطيبات (داخلية/خارجية).",
            "سداد تأمين أعمال قابل للاسترداد.",
            "الحصول على التصريح والبدء في الأعمال.",
        ],
        requiredDocs: [
            "صورة بطاقة المالك.",
            "صورة محضر استلام الوحدة.",
            "مخطط تفصيلي بالأعمال المطلوبة.",
        ],
    }
];

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

                {mockServiceGuides.map((guide) => (
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
