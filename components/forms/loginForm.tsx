import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { login } from "@/services/firebase/firebaseAuth";
import { LoginFormData, loginSchema } from "@/services/zodValidation";
import { saveUserData } from "@/utils/saveUserData";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomError from "../customError";
import CustomInputForm from "../customInputForm";


export default function LoginForm() {
    const { colors } = useTheme();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useUser()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const firebaseUser = await login(data.email.trim(), data.password);

            await saveUserData(firebaseUser, setUser)

            router.replace("/(drawer)/tabs/home");
        } catch (err: any) {
            console.error(err);
            Alert.alert("خطأ في التسجيل", err?.message || "حدث خطأ");
        }
    };

    return (
        <View className="w-full max-w-md mt-6 px-4 space-y-4">
            {/* Email Input */}
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInputForm
                        placeholder="البريد الالكترونى"
                        keyboardType="email-address"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                    />
                )}
            />
            {errors.email && <CustomError message={errors.email.message!} />}

            {/* Password Input */}
            <View style={{ position: "relative" }}>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <CustomInputForm
                            placeholder="كلمة المرور"
                            secureTextEntry={!showPassword}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                        />
                    )}
                />

                {/* Toggle Password */}
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{
                        position: "absolute",
                        right: 10,
                        top: "40%",
                        transform: [{ translateY: -12 }],
                        padding: 4,
                    }}
                >
                    {showPassword ? (
                        <Ionicons name="eye-off" size={24} color={colors.text} />
                    ) : (
                        <Ionicons name="eye" size={24} color={colors.text} />
                    )}
                </TouchableOpacity>
            </View>
            {errors.password && <CustomError message={errors.password.message!} />}

            {/* Forget Password */}
            {/* <TouchableOpacity
                onPress={() => router.push("/(auth)/forgetPassword")}
                className="mb-4 mt-1 flex items-start bg-transparent border-none"
            >
                <Text
                    className={`text-lg ${themeMode === "light" ? "text-blue-700" : "text-blue-500"
                        }`}
                    style={{ fontFamily: FONTS_CONSTANTS.bold }}
                >
                    نسيت كلمة المرور؟
                </Text>
            </TouchableOpacity> */}

            {/* Login Button */}
            <TouchableOpacity
                style={[
                    styles.submitButton,
                    isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.8}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator size={18} color="#fff" />
                ) : (
                    <Text style={styles.submitText}
                        className="text-lg text-white text-center"
                    >تسجيل الدخول</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    submitButton: {
        backgroundColor: "#0b69ff",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitText: {
        fontFamily: FONTS_CONSTANTS.bold,
    },
});
