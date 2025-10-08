import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { useImagePicker } from "@/hooks/useImagePicker";
import { Market } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface FormData {
    title: string;
    description: string;
    price: string;
    category: string;
    phone: string;
    expirationDays: string;
}

interface AddItemFormProps {
    onClose: () => void;
    onSave: (item: any) => void;
}

export default function AddItemForm({ onClose, onSave }: AddItemFormProps) {
    const { colors } = useTheme();
    const { user } = useUser();

    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        price: "",
        category: "",
        phone: "",
        expirationDays: "30",
    });

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const {
        isPicking,
        isUploading,
        pickImage,
        uploadImageToServer,
        clearPickedImage,
    } = useImagePicker();

    const handleAddImage = async () => {
        const localUri = await pickImage();
        if (!localUri) return;

        try {
            const uploadedUrl = await uploadImageToServer(localUri);
            setUploadedImages((prev) => [...prev, uploadedUrl]);
            clearPickedImage();
        } catch (err: any) {
            Alert.alert("خطأ في التحميل", err.message || "حدث خطأ أثناء رفع الصورة");
        }
    };

    const handleChange = (key: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (uploadedImages.length === 0) {
            Alert.alert("تنبيه", "يرجى إضافة صورة واحدة على الأقل.");
            return;
        }

        const expirationDays = parseInt(formData.expirationDays, 10);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);

        const newItem: Market = {
            ...formData,
            userId: user?.uid!,
            username: user?.username!,
            avatar: user?.imageUrl!,
            price: parseFloat(formData.price) || 0,
            images: uploadedImages,
            creationDate: new Date(),
            expirationDate,
            status: "pending",
        };

        onSave(newItem);
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
                    إضافة إعلان جديد
                </Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={26} color={colors.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Image Picker */}
            <TouchableOpacity
                onPress={handleAddImage}
                disabled={isPicking || isUploading}
                className="border border-dashed border-slate-400 rounded-xl p-6 mb-4 justify-center items-center"
            >
                {isUploading ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                ) : (
                    <>
                        <Ionicons name="images" size={36} color={colors.primary} />
                        <Text
                            className="mt-2"
                            style={{
                                fontFamily: FONTS_CONSTANTS.medium,
                                color: colors.muted,
                            }}
                        >
                            اضف صور المنتج
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Uploaded Images */}
            {uploadedImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {uploadedImages.map((uri, i) => (
                        <Image
                            key={i}
                            source={{ uri }}
                            className="w-28 h-28 rounded-lg mr-2"
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>
            )}

            {/* Form Inputs */}
            {[
                { key: "title", label: "عنوان الإعلان" },
                { key: "description", label: "الوصف" },
                { key: "price", label: "السعر (بالجنيه)" },
                { key: "category", label: "الفئة" },
                { key: "phone", label: "رقم الهاتف" },
            ].map((f) => (
                <View key={f.key} className="mt-4">
                    <Text
                        className="mb-1 text-base"
                        style={{
                            fontFamily: FONTS_CONSTANTS.medium,
                            color: colors.text,
                        }}
                    >
                        {f.label}
                    </Text>
                    <TextInput
                        value={formData[f.key as keyof FormData]}
                        onChangeText={(val) => handleChange(f.key as keyof FormData, val)}
                        className="bg-slate-100 rounded-lg px-4 py-2"
                        style={{
                            fontFamily: FONTS_CONSTANTS.regular,
                            color: colors.text,
                        }}
                    />
                </View>
            ))}

            {/* Expiration Date Selector */}
            <View className="mt-4">
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
                                        color: selected
                                            ? colors.primary
                                            : colors.text,
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
                    className="px-5 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                >
                    <Text
                        className="text-white"
                        style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                    >
                        إرسال للمراجعة
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
