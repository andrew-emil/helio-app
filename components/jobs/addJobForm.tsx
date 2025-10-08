import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { addJob } from "@/services/firebase/jobs";
import { JobDocData, jobType } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Toast from "react-native-toast-message";

interface AddJobFormProps {
    onClose: () => void;
    onSave: (job: JobDocData) => void;
}

export default function AddJobForm({ onClose, onSave }: AddJobFormProps) {
    const { colors } = useTheme();
    const { user } = useUser();

    const [formData, setFormData] = useState({
        title: "",
        companyName: "",
        description: "",
        location: "",
        type: "دوام كامل",
        contactInfo: "",
        expirationDays: "30",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (key: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (
            !formData.title ||
            !formData.companyName ||
            !formData.description ||
            !formData.location ||
            !formData.contactInfo
        ) {
            Toast.show({
                type: 'error',
                text1: "تنبيه",
                text2: "يرجى ملء جميع الحقول المطلوبة."
            })
            return;
        }

        setIsSubmitting(true);
        try {
            const expirationDays = parseInt(formData.expirationDays, 10);
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + expirationDays);

            const newJob: JobDocData = {
                userId: user?.uid!,
                username: user?.username!,
                avatar: user?.imageUrl!,
                title: formData.title,
                companyName: formData.companyName,
                description: formData.description,
                location: formData.location,
                type: formData.type as jobType,
                contactInfo: formData.contactInfo,
                creationDate: new Date(),
                expirationDate,
                status: 'pending'
            };

            await addJob(newJob)
            onSave(newJob);
        } catch (error: any) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: "حدث خطأ",
                text2: "تعذر حفظ الإعلان"
            })
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView
            className="flex-1 p-5"
            style={{ backgroundColor: colors.background }}
        >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <Text
                    className="text-xl"
                    style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                >
                    إضافة إعلان وظيفة
                </Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={26} color={colors.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Input Fields */}
            {[
                { key: "title", label: "عنوان الوظيفة" },
                { key: "companyName", label: "اسم الشركة" },
                { key: "description", label: "الوصف" },
                { key: "location", label: "الموقع" },
                { key: "contactInfo", label: "معلومات التواصل" },
            ].map((field) => (
                <View key={field.key} className="mt-4">
                    <Text
                        className="mb-1 text-base"
                        style={{
                            fontFamily: FONTS_CONSTANTS.medium,
                            color: colors.text,
                        }}
                    >
                        {field.label}
                    </Text>
                    <TextInput
                        value={formData[field.key as keyof typeof formData]}
                        onChangeText={(val) => handleChange(field.key as keyof typeof formData, val)}
                        className="bg-slate-100 rounded-lg px-4 py-2"
                        style={{
                            fontFamily: FONTS_CONSTANTS.regular,
                            color: colors.text,
                        }}
                        multiline={field.key === "description"}
                        numberOfLines={field.key === "description" ? 4 : 1}
                    />
                </View>
            ))}

            {/* Job Type Selector */}
            <View className="mt-5">
                <Text
                    className="mb-1 text-base"
                    style={{
                        fontFamily: FONTS_CONSTANTS.medium,
                        color: colors.text,
                    }}
                >
                    نوع الوظيفة
                </Text>
                <View className="flex-row flex-wrap gap-3 mt-1">
                    {["دوام كامل", "دوام جزئي", "عقد", "تدريب"].map((type) => {
                        const selected = formData.type === type;
                        return (
                            <TouchableOpacity
                                key={type}
                                onPress={() => handleChange("type", type)}
                                className={`px-4 py-2 rounded-lg border ${selected
                                    ? "border-blue-500 bg-blue-100"
                                    : "border-slate-300"
                                    }`}
                            >
                                <Text
                                    style={{
                                        fontFamily: FONTS_CONSTANTS.medium,
                                        color: selected ? colors.primary : colors.text,
                                    }}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Expiration Selector */}
            <View className="mt-6">
                <Text
                    className="mb-1 text-base"
                    style={{
                        fontFamily: FONTS_CONSTANTS.medium,
                        color: colors.text,
                    }}
                >
                    مدة صلاحية الإعلان
                </Text>
                <View className="flex-row gap-3 mt-1">
                    {["30", "60", "90"].map((days) => {
                        const selected = formData.expirationDays === days;
                        return (
                            <TouchableOpacity
                                key={days}
                                onPress={() => handleChange("expirationDays", days)}
                                className={`px-4 py-2 rounded-lg border ${selected
                                    ? "border-blue-500 bg-blue-100"
                                    : "border-slate-300"
                                    }`}
                            >
                                <Text
                                    style={{
                                        fontFamily: FONTS_CONSTANTS.medium,
                                        color: selected ? colors.primary : colors.text,
                                    }}
                                >
                                    {days} يوم
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Buttons */}
            <View className="flex-row justify-end gap-3 mt-8 mb-5">
                <TouchableOpacity
                    onPress={onClose}
                    className="px-5 py-2 rounded-lg"
                    style={{ backgroundColor: colors.border }}
                >
                    <Text style={{ fontFamily: FONTS_CONSTANTS.medium }}>إلغاء</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg flex-row items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text
                            className="text-white"
                            style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                        >
                            إرسال للمراجعة
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
