import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { useFavorites } from "@/hooks/useFavorites";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
    service: ServiceDocData;
    /**
     * Optional callback when user taps the rating UI (to open rating modal / navigate).
     * It will only be called when the user is logged in.
     */
    onRate?: (serviceId: string) => void;
};

const Rating: React.FC<{ rating?: number; size?: number; onPress?: () => void; disabled?: boolean }> = ({
    rating = 0,
    size = 16,
    onPress,
    disabled = true,
}) => {
    const stars = [...Array(5)].map((_, i) => (
        <Ionicons
            key={i}
            name={i < Math.round(rating) ? "star" : "star-outline"}
            size={size}
            color={i < Math.round(rating) ? "#facc15" : "#d1d5db"}
        />
    ));


    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}>
                <View className="flex-row items-center">{stars}</View>
            </TouchableOpacity>
        );
    }

    return <View className="flex-row items-center">{stars}</View>;
};

const ServiceCard: React.FC<Props> = ({ service, onRate }) => {
    const { isLoggedIn } = useUser();
    const { colors } = useTheme();
    const { favorites, toggle } = useFavorites();
    const [toggling, setToggling] = useState(false);
    const router = useRouter();

    const isFavorite = useMemo(() => favorites.some((f) => f.id === service.id), [favorites, service.id]);

    const promptLogin = () => {
        Alert.alert(
            "تسجيل دخول مطلوب",
            "الرجاء تسجيل الدخول لإجراء هذا الإجراء.",
            [{ text: "إلغاء", style: "cancel" }, { text: "حسناً", onPress: () => console.log("Open login flow") }]
        );
    };

    const handleFavoritePress = async () => {
        if (!isLoggedIn) {
            promptLogin();
            return;
        }
        if (toggling) return;
        setToggling(true);

        try {
            await toggle(service);
        } catch (err) {
            console.error("toggle favorite failed", err);
        } finally {
            setToggling(false);
        }
    };

    const handleRatingPress = () => {
        if (!isLoggedIn) {
            promptLogin();
            return;
        }
        if (onRate) onRate(service.id);
    };

    const mainImageUrl = useMemo(() => {
        const url = service.imageUrl;
        if (!url || !Array.isArray(url) || url.length === 0) return undefined;
        return url[0];
    }, [service.imageUrl]);
    const avg = service.avgRating ?? 0;

    return (
        <View className="relative w-full px-3 mt-3">
            <TouchableOpacity
                onPress={() => router.push(`/(drawer)/category/service/${service.id}`)}
                activeOpacity={0.85}
                className="rounded-xl shadow-lg overflow-hidden"
                style={{ backgroundColor: colors.surface }}
            >
                <View className="relative">
                    <Image
                        source={{ uri: mainImageUrl }}
                        style={{
                            width: '100%',
                            height: 192,
                            resizeMode: 'cover',
                            backgroundColor: colors.background,
                            opacity: 0.9
                        }}
                        // width={"100%"}
                        height={192}
                    />

                    <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex-row items-end justify-between">
                        <View className="flex-row items-center space-x-2">
                            {/* rating UI: interactive only if user is logged in and onRate is provided */}
                            <Rating rating={avg} size={14} onPress={isLoggedIn && onRate ? handleRatingPress : undefined} disabled={!isLoggedIn} />
                        </View>

                        {service.subCategory ? (
                            <View className="bg-black/40 px-2 py-1 rounded">
                                <Text className="text-xs" style={{ fontFamily: FONTS_CONSTANTS.regular, color: "#fff" }}>
                                    {service.subCategory}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                <View className="p-4">
                    <Text className="text-lg mb-1 truncate" style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}>
                        {service.name}
                    </Text>

                    <Text className="text-sm truncate" style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}>
                        {service.address}
                    </Text>

                    <View className="flex-row items-center mt-2 space-x-3">
                        {service.phone ? (
                            <View className="flex-row items-center space-x-1">
                                <Ionicons name="call" size={14} color={colors.iconColor} />
                                <Text className="text-xs" style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}>
                                    {service.phone}
                                </Text>
                            </View>
                        ) : null}

                        {service.workTime ? (
                            <View className="flex-row items-center space-x-1">
                                <Ionicons name="time" size={14} color={colors.iconColor} />
                                <Text className="text-xs" style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}>
                                    {service.workTime}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleFavoritePress}
                className="absolute top-3 left-6 bg-black/30 backdrop-blur-sm p-2 rounded-full z-10"
                accessibilityLabel={isLoggedIn ? "Toggle favorite" : "Login required to favorite"}
                disabled={toggling}
            >
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? colors.error : colors.iconColor} />
            </TouchableOpacity>
        </View>
    );
};

export default ServiceCard;
