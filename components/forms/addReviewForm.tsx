import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { addRating } from "@/services/firebase/reviews";
import { RatingsStorage } from "@/services/storage/ratingsStorage";
import { RatingDocData } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import CustomInputForm from "../customInputForm";

export const AddReviewForm: React.FC<{
    serviceId: string;
    categoryName: string;
    serviceName: string;
}> = ({ serviceId, categoryName, serviceName }) => {
    const { colors } = useTheme();
    const { user } = useUser();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const submittingRef = useRef(false);
    const queryClient = new QueryClient();

    const handleSubmit = async () => {
        setLoading(true);
        if (rating === 0) {
            Toast.show({
                type: "error",
                text1: "يرجى اختيار تقييم",
                text1Style: {
                    fontFamily: FONTS_CONSTANTS.semiBold,
                    color: colors.error,
                },
            });
            return;
        }
        if (submittingRef.current) return;
        submittingRef.current = true;
        try {
            const payload: RatingDocData = {
                userId: user?.uid!,
                userName: user?.username!,
                avatar: user?.imageUrl,
                rating,
                comment,
                createdAt: new Date(),
            };
            await Promise.all([
                addRating(categoryName, serviceId, payload),
                queryClient.invalidateQueries({ queryKey: ["reviews"] }),
                RatingsStorage.addRating({
                    serviceName,
                    rating,
                    comment,
                    createdAt: new Date(),
                })
            ]);
            setRating(0);
            setComment("");
            Toast.show({
                type: "success",
                text1: "تم إضافة تقييمك بنجاح",
                text1Style: {
                    fontFamily: FONTS_CONSTANTS.semiBold,
                    color: "#FFF",
                },
            });
        } catch (err) {
            console.error(err);
            Toast.show({
                type: "error",
                text1: "فشل إرسال التقييم",
                text1Style: {
                    fontFamily: FONTS_CONSTANTS.semiBold,
                    color: colors.error,
                },
            });
        } finally {
            submittingRef.current = false;
            setLoading(false);
        }
    };

    return (
        <View
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: colors.surface }}
        >
            <Text
                className="text-xl mb-3"
                style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.bold }}
            >
                أضف تقييمك
            </Text>

            <View className="mb-3 flex-row items-center">
                {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    return (
                        <TouchableOpacity
                            key={value}
                            onPress={() => setRating(value)}
                            activeOpacity={0.7}
                            className="p-1"
                        >
                            <Ionicons
                                name={value <= rating ? "star" : "star-outline"}
                                size={28}
                                color={value <= rating ? "#fbbf24" : "#9ca3af"}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            <CustomInputForm
                value={comment}
                onChangeText={setComment}
                placeholder="اكتب تعليقك هنا..."
                multiline
                numberOfLines={4}
                style={{ textAlignVertical: "top", minHeight: 100 }}
            />

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="mt-4 px-4 py-3 bg-cyan-500 rounded-lg items-center"
            >
                {loading ? (
                    <ActivityIndicator color={"#FFF"} />
                ) : (
                    <Text
                        className="text-white"
                        style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                    >
                        إرسال التقييم
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};
