import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ErrorFallback({ error, resetErrorBoundary }: any) {
    const { colors, themeMode } = useTheme()
    const router = useRouter()

    return (
        <View
            className={`${themeMode === "light" ? "screen" : "screen-dark p-5"}`}>
            <Text style={{ marginBottom: 10, fontFamily: FONTS_CONSTANTS.bold }}>فشل تحميل الخبر.</Text>
            <TouchableOpacity onPress={resetErrorBoundary}
                style={{ backgroundColor: colors.surface, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }} >
                <Text className="text-white text-center"
                    style={{ fontFamily: FONTS_CONSTANTS.medium }}>
                    حاول مرة أخرى
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/(drawer)/tabs/home')}
                style={{ backgroundColor: colors.primary, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }} >
                <Text className="text-white text-center"
                    style={{ fontFamily: FONTS_CONSTANTS.medium }}>
                    العودة الى الرئيسية
                </Text>
            </TouchableOpacity>
        </View>
    );
}