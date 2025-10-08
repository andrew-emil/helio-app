import EmptyState from "@/components/emptyState";
import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import ShareButton from "@/components/shareButton";
import SliderDetails from "@/components/sliderDetails";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useBg } from "@/hooks/useBg";
import { getPropertyById } from "@/services/firebase/properties";
import { PropertyDocData } from "@/types/firebaseDocs.type";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyDetails() {
    const { colors } = useTheme()
    const { propertyId } = useLocalSearchParams()
    const { bg } = useBg()

    const { data: property, isLoading, error } = useQuery<PropertyDocData | null>({
        queryKey: ['property'],
        queryFn: async () => await getPropertyById(propertyId as string),
        enabled: !!propertyId
    })
    if (isLoading) return <Spinner />
    if (error) return <ErrorFallback />
    if(!property){
        return (
            <View style={{ backgroundColor: colors.background }}
            className="flex-1 justify-center items-center bg-transparent"
            >
                <EmptyState
                    icon={<Entypo name="home" size={64} color="#94a3b8" />}
                    title="لا توجد عقارات تطابق بحثك"
                    message="حاول تغيير الفلاتر أو توسيع نطاق البحث للعثور على ما تبحث عنه."
                />
            </View>
        )
    }

    const priceLabel = property.type === 'sale' ? 'سعر البيع' : 'سعر الإيجار الشهري';

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
                    title={property.title}
                    subtitle={property.address}
                    icon={<Ionicons name="business" size={48} color="oklch(76.9% 0.188 70.08)" />}
                />
                {/* Image Slider */}
                {property.images.length > 0 && (
                    <View style={{ paddingVertical: 4, paddingHorizontal: 12, height: 350 }}>
                        <SliderDetails images={property.images} />
                    </View>
                )}

                {/* Description Section */}
                <View className={`mt-5 p-4 rounded-2xl mx-3 shadow-md`}
                    style={{ backgroundColor: colors.surface }}
                >
                    <Text className={`text-2xl border-b pb-2 mb-3`}
                        style={{ fontFamily: FONTS_CONSTANTS.bold, borderColor: colors.border, color: colors.text }}
                    >
                        الوصف
                    </Text>
                    <Text className={`leading-6`}
                        style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                    >
                        {property.description}
                    </Text>

                    {/* Amenities */}
                    {property.amenities.length > 0 && (
                        <View className={`mt-6`}>
                            <Text className={`text-xl mb-3`}
                                style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                            >
                                وسائل الراحة
                            </Text>
                            <View className={`flex-row flex-wrap gap-2`}>
                                {property.amenities.map((a, i) => (
                                    <View key={i} className={`flex-row items-center gap-2 p-2 ${bg("bg-slate-100", "bg-slate-700")} rounded-lg`}>
                                        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                                        <Text style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.text }}>{a}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Contact Card */}
                <View className={`mt-5 mx-3 p-5 rounded-2xl shadow-lg border`}
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                >
                    <View className={`border-b pb-3 mb-4`}
                        style={{ borderColor: colors.border }}
                    >
                        <View className={`self-start px-3 py-1 rounded-full ${property.type === 'sale' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                            <Text
                                style={{ fontFamily: FONTS_CONSTANTS.bold, color: "#FFF" }}
                            >
                                {property.type === 'sale' ? 'للبيع' : 'للإيجار'}
                            </Text>
                        </View>
                        <Text className={`text-3xl font-extrabold ${bg("text-cyan-600", "text-cyan-400")} mt-3`}
                            style={{ fontFamily: FONTS_CONSTANTS.bold }}
                        >
                            {property.price.toLocaleString('ar-EG')}
                        </Text>
                        <Text style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}>{priceLabel}</Text>
                    </View>

                    <Text className={`text-xl mb-3`}
                        style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                    >
                        معلومات الاتصال
                    </Text>

                    <View className={`flex-row items-center gap-2 mb-4`}>
                        <Ionicons name="person-circle-outline" size={22} color="#9ca3af" />
                        <Text style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: colors.muted }}>
                            {property.contactName}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${property.phone}`)}
                        className={`flex-row items-center justify-center gap-2 bg-green-500 py-3 rounded-xl`}
                    >
                        <Ionicons name="call-outline" size={22} color="white" />
                        <Text className={`text-white font-bold text-lg`}>اتصال: {property.phone}</Text>
                    </TouchableOpacity>

                    <ShareButton
                        title="مشاركة"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}