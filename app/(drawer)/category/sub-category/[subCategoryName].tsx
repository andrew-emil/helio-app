import PageBanner from "@/components/pageBanner";
import ServiceCard from "@/components/service/servicesCard";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useData } from "@/context/dataContext";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceCategoriesScreen() {
    const { subCategoryName } = useLocalSearchParams()
    const { services } = useData()
    const { colors } = useTheme()
    const filteredServices = services.filter((s) => s.subCategory === subCategoryName)

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
                    title={subCategoryName as string}
                    subtitle={filteredServices[0].category}
                    icon={<Ionicons name="briefcase" size={48} color="#06B6D4" />}
                />

                {filteredServices && filteredServices.length > 0 ? (
                    <View className="flex-1 flex-col justify-center items-center gap-6">
                        {filteredServices.map(service => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </View>
                ) : (
                    <View className="text-center py-16 rounded-xl shadow-lg"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <Text className="text-xl"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                        >
                            لا توجد خدمات متاحة
                        </Text>
                        <Text className="mt-2"
                            style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                        >
                            لا توجد خدمات مضافة في هذه الفئة حالياً. يرجى المحاولة مرة أخرى لاحقاً.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}