import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useData } from "@/context/dataContext";
import { useUser } from "@/context/userContext";
import { useTheme } from "@/context/themeContext";
import type { Service } from "@/types/dataContext.type";

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

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const { handleToggleFavorite } = useData();
    const { isLoggedIn } = useUser();
    const { colors } = useTheme();

    const onFavoriteClick = () => {
        handleToggleFavorite(service.id);
    };

    return (
        <View className="relative">
            <Link
                href={`/(drawer)/tabs/service/${service.id}`}
                asChild
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
                >
                    {/* Image */}
                    <View className="relative">
                        <Image
                            source={{
                                uri:
                                    service.images[0] ||
                                    `https://picsum.photos/400/300?random=${service.id}`,
                            }}
                            className="w-full h-48"
                            resizeMode="cover"
                        />
                        <View className="absolute bottom-0 right-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <Rating rating={service.rating} />
                        </View>
                    </View>

                    {/* Text content */}
                    <View className="p-4">
                        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-1 truncate">
                            {service.name}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm truncate">
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
                    {service.isFavorite ? (
                        <Ionicons name="heart" size={20} color={colors.error} />
                    ) : (
                        <Ionicons
                            name="heart-outline"
                            size={20}
                            color={colors.iconColor}
                        />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ServiceCard;