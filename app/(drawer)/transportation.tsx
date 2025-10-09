import PageBanner from "@/components/pageBanner";
import BusTabs from "@/components/transportations/busesTabs";
import { useTheme } from "@/context/themeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transportation() {
    const { colors } = useTheme()


    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 12,
                    alignItems: "stretch",
                }}
            >
                <PageBanner
                    title="دليل المواصلات"
                    subtitle="كل ما تحتاجه لمعرفة مواعيد وخطوط سير الباصات."
                    icon={<FontAwesome6 name="truck" size={40} color="#5F4892" />}
                />
                <View className="mt-8 w-full">
                    <BusTabs />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}