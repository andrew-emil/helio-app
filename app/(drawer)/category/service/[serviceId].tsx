import { AddReviewForm } from "@/components/forms/addReviewForm";
import { RatingDisplay } from "@/components/service/ratingDisplay";
import ShareButton from "@/components/shareButton";
import SliderDetails from "@/components/sliderDetails";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useData } from "@/context/dataContext";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { useFavorites } from "@/hooks/useFavorites";
import { getServiceRatings } from "@/services/firebase/reviews";
import { FavStorage } from "@/services/storage/favoriteStorage";
import { RatingDocData } from "@/types/firebaseDocs.type";
import { normalizeImageUrls } from "@/utils/normalizeImageUrl";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Service() {
    const { serviceId } = useLocalSearchParams();
    const { services } = useData();
    const { colors } = useTheme();
    const { toggle } = useFavorites()
    const { isLoggedIn } = useUser();
    const router = useRouter();
    const [sortOrder, setSortOrder] = useState<'latest' | 'highest'>('latest');

    const service = services.find((s) => s.id === serviceId);
    const categoryName = service?.category

    const { data, isLoading } = useQuery({
        queryKey: ['reviews', 'favs'],
        queryFn: async () => {
            const reviews = await getServiceRatings(serviceId as string, categoryName ?? "")
            const myFavorites = await FavStorage.getFavorites()
            return { reviews, myFavorites }
        }
    });

    const sortedReviews = useMemo(() => {
        if (!service || !data?.reviews || !Array.isArray(data.reviews)) return [];
        switch (sortOrder) {
            case 'highest':
                return [...data.reviews].sort((a, b) => b.rating - a.rating);
            case 'latest':
            default:
                return [...data.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [data?.reviews, service, sortOrder]);

    if (!data || isLoading) return <Spinner />;

    const { myFavorites } = data
    const isFavorite = myFavorites.find(f => f.id === serviceId)

    if (!service) {
        return <div className="flex items-center justify-center h-screen"><Spinner /> <p className="ml-4">جاري تحميل الخدمة...</p></div>;
    }
    const images = normalizeImageUrls(service.imageUrl);

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
                {/* Image Slider */}
                {images.length > 0 && (
                    <View style={{ paddingVertical: 4, paddingHorizontal: 12, height: 350 }}>
                        <SliderDetails images={images} />
                    </View>
                )}

                <View className="mt-4 flex-row justify-between items-start">
                    <View style={{ flex: 1 }}>
                        <Text className="text-2xl"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                        >{service?.name}</Text>
                        {service?.address ? (
                            <Text className="text-sm mt-1"
                                style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                            >{service.address}</Text>
                        ) : null}
                        <View className="my-4">
                            <RatingDisplay rating={service?.avgRating || 0} reviewCount={(service?.ratingCount || 0)} />
                        </View>
                    </View>


                    {isLoggedIn && (
                        <TouchableOpacity
                            onPress={() => toggle(service)}
                            className="p-2 rounded-full"
                            style={{ marginLeft: 12 }}
                        >
                            {isFavorite ? (
                                <AntDesign name="heart" size={28} color={colors.error} />
                            ) : (
                                <AntDesign name="heart" size={28} color={colors.text} />
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Main content */}
                <View className="mt-6 md:flex-row">
                    <View className="md:flex-1">
                        <View className="prose max-w-none">
                            <Text className="text-xl font-bold mb-2"
                                style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.muted }}
                            >حول الخدمة</Text>
                            <Text className="text-base"
                                style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                            >{service?.description}</Text>
                        </View>
                    </View>

                    <View className="mt-6 md:mt-0 md:ml-6">
                        <View className="p-4 rounded-xl shadow border"
                            style={{ backgroundColor: colors.surface, borderColor: colors.muted }}
                        >
                            <Text className="text-lg mb-3"
                                style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                            >معلومات وتواصل</Text>

                            <View className="space-y-3">
                                {service?.workTime ? (
                                    <View className="flex-row items-start gap-3">
                                        <Ionicons name="time-outline" size={18} color="#9ca3af" />
                                        <View>
                                            {String(service.workTime)
                                                .split("\n")
                                                .map((line: string, i: number) => (
                                                    <Text key={i} className="text-sm"
                                                        style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}>
                                                        {line}
                                                    </Text>
                                                ))}
                                        </View>
                                    </View>
                                ) : null}

                                {service?.address ? (
                                    <TouchableOpacity onPress={() => Linking.openURL(service?.address)} className="flex-row items-center gap-3">
                                        <Ionicons name="location-outline" size={18} color="#9ca3af" />
                                        <Text className="text-cyan-500"
                                            style={{ fontFamily: FONTS_CONSTANTS.regular }}
                                        >عرض على الخريطة</Text>
                                    </TouchableOpacity>
                                ) : null}

                                {service?.facebookLink ? (
                                    <TouchableOpacity onPress={() => Linking.openURL(service?.facebookLink as string)} className="flex-row items-center gap-3">
                                        <Ionicons name="logo-facebook" size={18} color="#9ca3af" />
                                        <Text className="text-cyan-500"
                                            style={{ fontFamily: FONTS_CONSTANTS.regular }}>صفحة الفيسبوك</Text>
                                    </TouchableOpacity>
                                ) : null}

                                {service?.integramLink ? (
                                    <TouchableOpacity onPress={() => Linking.openURL(service?.integramLink as string)} className="flex-row items-center gap-3">
                                        <Ionicons name="logo-instagram" size={18} color="#9ca3af" />
                                        <Text className="text-cyan-500"
                                            style={{ fontFamily: FONTS_CONSTANTS.regular }}>صفحة الإنستغرام</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                            {/* Phones & WhatsApp */}
                            <View className="mt-4 space-y-2 flex gap-4 w-full">
                                {
                                    service?.phone && (
                                        <TouchableOpacity
                                            className="w-full flex-row items-center justify-center gap-3 bg-green-500 py-3 rounded-lg"
                                            onPress={() => Linking.openURL(`tel:${service?.phone}`)}
                                        >
                                            <Ionicons name="call" size={18} color="white" />
                                            <Text className="text-white"
                                                style={{ fontFamily: FONTS_CONSTANTS.bold }}
                                            >اتصال: {service?.phone}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    service?.secondPhone && (
                                        <TouchableOpacity
                                            className="w-full flex-row items-center justify-center gap-3 bg-green-500 py-3 rounded-lg"
                                            onPress={() => Linking.openURL(`tel:${service?.phone}`)}
                                        >
                                            <Ionicons name="call" size={18} color="white" />
                                            <Text className="text-white"
                                            >اتصال: {service?.phone}</Text>
                                        </TouchableOpacity>
                                    )
                                }

                                {service?.whatsapp && (
                                    <TouchableOpacity
                                        className="w-full flex-row items-center justify-center gap-3 bg-emerald-500 py-3 rounded-lg"
                                        onPress={() => Linking.openURL(`https://wa.me/${service?.whatsapp}`)}
                                    >
                                        <FontAwesome6 name="whatsapp" size={18} color="white" />
                                        <Text className="text-white font-bold">واتساب</Text>
                                    </TouchableOpacity>
                                )}

                                <View className="mt-2">
                                    <ShareButton
                                        title={service?.name as string}
                                        text={`تحقق من هذه الخدمة في تطبيق Helio: ${service?.name}`}
                                        className="w-full flex justify-center items-center"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Reviews */}
                <View className="mt-8">
                    <View className="flex-row justify-between items-center border-t pt-4"
                        style={{ borderColor: colors.muted }}
                    >
                        <Text className="text-2xl mb-2"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                        >التقييمات والآراء ({(service?.ratingCount || 0)})</Text>

                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => setSortOrder("latest")}
                                className={`px-2 py-1 rounded ${sortOrder === "latest" ? "bg-cyan-500" : "bg-slate-100"}`}
                            >
                                <Text className={`text-sm font-cairo ${sortOrder === "latest" ? "text-white" : "text-gray-700"}`}>الأحدث</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setSortOrder("highest")}
                                className={`ml-2 px-2 py-1 rounded ${sortOrder === "highest" ? "bg-cyan-500" : "bg-slate-100"}`}
                            >
                                <Text className={`text-sm font-cairo ${sortOrder === "highest" ? "text-white" : "text-gray-700"}`}>الأعلى</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="space-y-4 mt-4">
                        {(sortedReviews || []).length > 0 ? (
                            sortedReviews?.map((review: RatingDocData, index) => (
                                <View key={review.id ?? index} className="p-4 rounded-lg"
                                    style={{ backgroundColor: colors.surface }}
                                >
                                    <View className="flex-row justify-between items-start gap-4">
                                        <View className="flex-row items-center gap-3">
                                            <Image
                                                source={{ uri: review.avatar }}
                                                className="w-12 h-12 rounded-full"
                                                resizeMode="cover"
                                            />

                                            <View>
                                                <Text
                                                    style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                                                >{review.userName}</Text>
                                                <Text className="text-sm"
                                                    style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                                                >{review.createdAt.toLocaleDateString("ar-EG")}</Text>
                                                <RatingDisplay rating={review.rating} reviewCount={0} size={14} />
                                            </View>
                                        </View>
                                    </View>

                                    <Text className="mt-3"
                                        style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                                    >{review.comment}</Text>
                                </View>
                            ))
                        ) : (
                            <Text className="text-center font-cairo text-gray-500 py-8">كن أول من يضيف تقييماً لهذه الخدمة.</Text>
                        )}
                    </View>
                </View>

                {/* Add Review or prompt */}
                {isLoggedIn ? (
                    <AddReviewForm serviceId={service.id} categoryName={categoryName as string} serviceName={service.name} />
                ) : (
                    <View className="mt-6 p-4 rounded-lg items-center"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <Text className="font-semibold mb-2">هل ترغب في إضافة تقييمك؟</Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                            <Text className="text-cyan-500 font-bold">سجل الدخول</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Toast />
            </ScrollView>
        </SafeAreaView >
    )
}