import LoginForm from "@/components/forms/loginForm";
import GoogleLoginButton from "@/components/googleLoginButton";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
    const { colors, themeMode } = useTheme();
    const { setGuest } = useUser()
    const router = useRouter()

    const handleGuestLogin = async () => {
        await setGuest(true);
        router.replace('/(drawer)/tabs/home');
    }

    return (
        <SafeAreaView
            style={{ backgroundColor: colors.background }}
            className="flex-1 py-6 flex items-center justify-center"
        >
            <View className={
                `${themeMode === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl shadow-2xl p-8 animate-fade-in-up items-center w-full px-2`
            }>
                <Text
                    style={{
                        color: colors.text, fontFamily: FONTS_CONSTANTS.bold
                    }}
                    className="text-3xl text-center mb-3">تسجيل الدخول</Text>
                <Text
                    style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                    className={`text-center ${themeMode === "light" ? "text-gray-500" : "text-gray-400"} mb-3`}>أهلاً بعودتك! سجل الدخول للمتابعة.
                </Text>

                <LoginForm />

                {/* Separator */}
                <View className="w-full my-5 flex-row items-center">
                    <View className="flex-1 h-0.5 bg-gray-600 w-3/4" />
                    <Text className="mx-2 text-gray-600 text-sm"
                        style={{ fontFamily: FONTS_CONSTANTS.regular }}>أو تسجيل باستخدام</Text>
                    <View className="flex-1 h-0.5 bg-gray-600" />
                </View>

                {/* Google Button */}
                {/* <View className="w-full flex items-center mt-2 ">
                    <GoogleLoginButton />
                </View> */}

                {/* Guest Login */}
                <View className="w-full flex items-center mt-2">
                    <TouchableOpacity
                        className="mt-4 flex-row items-center justify-center border border-blue-600 p-3 rounded-lg w-[85%]"
                        onPress={handleGuestLogin}
                    >
                        <Ionicons name="person-outline" size={22} color="#2563eb" />
                        <Text className="text-blue-600 text-lg mx-2" style={{ fontFamily: FONTS_CONSTANTS.medium }}>
                            الدخول كضيف
                        </Text>
                    </TouchableOpacity>

                </View>

                <View className="flex-row mt-6">
                    <Text className="mx-2 text-lg"
                        style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.bold }}>
                        ليس لديك حساب؟{'  '}
                        <Text
                            className={`text-lg ${themeMode === "light" ? "text-blue-700" : "text-blue-500"}`}
                            onPress={() => {
                                router.replace('/(auth)/register')
                            }}
                            style={{ fontFamily: FONTS_CONSTANTS.bold }}
                        >
                            إنشاء حساب
                        </Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

