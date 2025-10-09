import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";


// ------------------
// Call Button
// ------------------
export const CallButton: React.FC<{ phone: string }> = ({ phone }) => {
    const handlePress = () => {
        Linking.openURL(`tel:${phone}`);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center justify-center gap-2 bg-green-500 px-3 py-1.5 rounded-md active:bg-green-600"
        >
            <Ionicons name="call-outline" size={18} color="white" />
            <Text className="text-white text-sm"
                style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
            >اتصال</Text>
        </TouchableOpacity>
    );
};

// ------------------
// Supervisor Card
// ------------------
const SupervisorCard: React.FC<{
    name: string;
    phone: string;
    title?: string;
    iconColor?: string;
}> = ({ name, phone, title = "مشرف الباصات الخارجية", iconColor = "text-blue-500" }) => {
    const { colors } = useTheme()

    return (
        <View className=" p-4 rounded-xl shadow-md flex-row items-center justify-between mb-4"
            style={{ backgroundColor: colors.surface }}
        >
            <View className="flex-row items-center gap-3">
                <Ionicons name="person-circle-outline" size={42} color={colors.primary} />
                <View>
                    <Text
                        style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                    >
                        {name}
                    </Text>
                    <Text className="text-sm"
                        style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                    >
                        {title}
                    </Text>
                </View>
            </View>

            <CallButton phone={phone} />
        </View>
    );
};

export default SupervisorCard;
