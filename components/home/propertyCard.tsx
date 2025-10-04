import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { PropertyDocData } from "@/types/firebaseDocs.type";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

const PropertyCard: React.FC<{ property: PropertyDocData }> = ({ property }) => {
    const navigation = useNavigation();
    const { colors } = useTheme()
    console.log(property)

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-xl shadow-lg overflow-hidden mb-4"
            style={{ backgroundColor: colors.surface }}
        //TODO: add the page
        // onPress={() => navigation.navigate("PropertyDetails", { id: property.id })}
        >
            {/* Image + Type Badge */}
            <View className="relative">
                <Image
                    source={{
                        uri: property.images?.[0] ?? "https://picsum.photos/600/400?random=30",
                    }}
                    className="w-full h-48"
                    resizeMode="cover"
                />

                <View
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full ${property.type === "sale" ? "bg-cyan-500" : "bg-purple-500"
                        }`}
                >
                    <Text className="text-sm text-white"
                        style={{ fontFamily: FONTS_CONSTANTS.bold }}
                    >
                        {property.type === "sale" ? "للبيع" : "للإيجار"}
                    </Text>
                </View>
            </View>

            {/* Details */}
            <View className="p-4">
                <Text
                    className="text-lgmb-2"
                    style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                    numberOfLines={3}
                >
                    {property.description}
                </Text>
                {/* Contact */}
                <View className="flex-row justify-between items-center border-t pt-3"
                    style={{ borderColor: colors.muted }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            // open phone dialer
                            const url = `tel:${property.phone}`;
                            Linking.openURL(url);
                        }}
                    >
                        <Text style={{ fontFamily: FONTS_CONSTANTS.bold, color:'#16a34a'}}
                        >
                            {property.phone}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PropertyCard;
