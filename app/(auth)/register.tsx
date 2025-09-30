import RegisterForm from "@/components/forms/registerForm";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Register() {
    const { colors, themeMode } = useTheme();
    const router = useRouter()

    return (
        <SafeAreaView
            style={{ backgroundColor: colors.background }}
            className="flex-1 py-6 flex items-center justify-center"
        >
            <View className={
                `${themeMode === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl shadow-2xl p-8 animate-fade-in-up items-center w-full px-2`
            }>
                <Text
                    style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.bold }}
                    className={"text-3xl text-center mb-3"}>إنشاء حساب جديد
                </Text>
                <Text
                    style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                    className={`text-center ${themeMode === "light" ? "text-gray-500" : "text-gray-400"} mb-3`}>انضم إلى مجتمع هليوبوليس الجديدة.
                </Text>
                <RegisterForm />

                <View className="flex-row mt-6">
                    <Text className="mx-2 text-lg"
                        style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.bold }}>
                        لديك حساب بالفعل؟{'  '}
                        <Text
                            className={`text-lg ${themeMode === "light" ? "text-blue-700" : "text-blue-500"}`}
                            onPress={() => {
                                router.replace('/(auth)/login')
                            }}
                            style={{ fontFamily: FONTS_CONSTANTS.bold }}
                        >
                            تسجيل الدخول
                        </Text>
                    </Text>
                </View>
            </View>

        </SafeAreaView>
    )
}