import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <View className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Ionicons
                key={i}
                name={i < Math.round(rating) ? "star" : "star-outline"}
                size={16}
                color={i < Math.round(rating) ? "#facc15" : "#d1d5db"}
            />
        ))}
    </View>
);

const ServiceCard: React.FC<{ service: ServiceDocData }> = ({ service }) => {
    // const { handleToggleFavorite } = useData();
    const { isLoggedIn } = useUser();
    const { colors } = useTheme();

    const onFavoriteClick = () => {
        // handleToggleFavorite(service.id);
        console.log("not implemented")
    };

    return (
        <View className="relative">
            <Link
                href={`/(drawer)/category/service/${service.id}`}
                asChild
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{ backgroundColor: colors.surface }}
                >
                    {/* Image */}
                    <View className="relative">
                        <Image
                            source={{
                                uri: service.imageUrl
                            }}
                            className="w-full h-48"
                            resizeMode="cover"
                        />
                        <View className="absolute bottom-0 right-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                            {/* <Rating rating={service.rating} /> */}
                        </View>
                    </View>

                    {/* Text content */}
                    <View className="p-4">
                        <Text className="text-lg mb-1 truncate"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                        >
                            {service.name}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm truncate"
                            style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                        >
                            {service.address}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Link>

            {/* Favorite button */}
            {isLoggedIn && (
                <TouchableOpacity
                    onPress={onFavoriteClick}
                    className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm p-2 rounded-full z-10"
                >
                    {/* {service.isFavorite ? (
                        <Ionicons name="heart" size={20} color={colors.error} />
                    ) : (
                        <Ionicons
                            name="heart-outline"
                            size={20}
                            color={colors.iconColor}
                        />
                    )} */}
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ServiceCard;