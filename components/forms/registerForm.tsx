import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { register } from "@/services/firebase/firebaseAuth";
import { UserStorage } from "@/services/storage/userStoage";
import { saveUserProfile } from "@/services/user";
import { RegisterData, registerSchema } from "@/services/zodValidation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import CustomError from "../customError";
import CustomInputForm from "../customInputForm";

export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { colors } = useTheme();
    const { setUser } = useUser()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", email: "", password: "" },
    });

    const onSubmit = async (data: RegisterData) => {
        try {
            const firebaseUser = await register(
                data.email.trim(),
                data.password,
                data.username.trim()
            );
            await saveUserProfile(firebaseUser.uid, {
                username: firebaseUser.displayName || "مستخدم",
                email: firebaseUser.email || "",
                imageUrl: firebaseUser.photoURL || null
            });
            // Fallbacks in case profile fields are missing
            const username = firebaseUser.displayName || "مستخدم";
            const email = firebaseUser.email || "";
            const imageUrl = firebaseUser.photoURL || "";

            const loggedUser = await UserStorage.setUserData(
                {
                    username,
                    email,
                    imageUrl,
                    uid: firebaseUser.uid,
                    createdAt: new Date()
                },
                false
            );
            if (!loggedUser) throw Error("حدث خطأ فى التسجيل")

            setUser(loggedUser)
            router.replace('/(drawer)/tabs/home');
        } catch (err: any) {
            console.error(err);
            Alert.alert("خطأ في التسجيل", err?.message || "حدث خطأ");
        }
    };

    return (
        <View className="w-full max-w-md mt-6 px-4 space-y-6">
            {/* Username */}
            <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <CustomInputForm
                            placeholder="اسم المستخدم"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                        />
                        {errors.username && (
                            <CustomError message={errors.username.message!} />
                        )}
                    </>
                )}
            />

            {/* Email */}
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <CustomInputForm
                            placeholder="البريد الإلكتروني"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email && (
                            <CustomError message={errors.email.message!} />
                        )}
                    </>
                )}
            />

            {/* Password */}
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <View style={{ position: "relative" }}>
                            <CustomInputForm
                                placeholder="كلمة المرور"
                                secureTextEntry={!showPassword}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: 8,
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
                        {errors.password && (
                            <CustomError message={errors.password.message!} />
                        )}
                    </>
                )}
            />
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
                    >إنشاء الحساب
                    </Text>
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
        display: "flex",
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
        fontFamily: FONTS_CONSTANTS.semiBold,
    },
});
