import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const RatingDisplay: React.FC<{ rating: number; reviewCount: number; size?: number }> = ({
    rating,
    reviewCount,
    size = 18,
}) => {
    const rounded = Math.round(rating);
    const { colors } = useTheme();

    return (
        <View className="flex-row items-center gap-2">
            <View className="flex-row">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                        key={i}
                        name={i < rounded ? "star" : "star-outline"}
                        size={size}
                        color={i < rounded ? "#fbbf24" : "#d1d5db"}
                        style={{ marginRight: 4 }}
                    />
                ))}
            </View>
            <Text
                style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
            >
                {rating.toFixed(1)}
            </Text>
            {reviewCount > 0 && (
                <Text
                    style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                >
                    ({reviewCount} تقييم)
                </Text>
            )}
        </View>
    );
};