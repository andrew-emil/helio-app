import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { Market } from "@/types/firebaseDocs.type";
import { Feather } from "@expo/vector-icons";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

export const MarketplaceItemCard = ({ item }: { item: Market }) => {
    const { colors } = useTheme()
    return (
        <View className="pr-4"
        >
            <Image
                source={{ uri: item.images[0] }}
                className="w-full h-40"
                resizeMode="cover"
            />
            <View className="p-3">
                <Text
                    numberOfLines={1}
                    className="text-lg"
                    style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                >
                    {item.title}
                </Text>
                <Text
                    numberOfLines={2}
                    className="text-sm mt-1 text-gray-500"
                    style={{ fontFamily: FONTS_CONSTANTS.regular }}
                >
                    {item.description}
                </Text>

                <View className="flex-row justify-between items-center mt-3">
                    <Text
                        className="text-cyan-600 text-lg"
                        style={{ fontFamily: FONTS_CONSTANTS.bold }}
                    >
                        {item.price.toLocaleString("ar-EG")} جنيه
                    </Text>
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${item.phone}`)}
                        className="flex-row items-center gap-1 px-3 py-1.5 rounded-md"
                        style={{ backgroundColor: "#22C55E" }}
                    >
                        <Feather name="phone" size={14} color="#fff" />
                        <Text
                            className="text-white text-sm"
                            style={{ fontFamily: FONTS_CONSTANTS.medium }}
                        >
                            تواصل
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};