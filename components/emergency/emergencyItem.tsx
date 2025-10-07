import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { EmerengyDocData } from "@/types/firebaseDocs.type";
import { Feather } from "@expo/vector-icons";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";

export default function EmergencyItem({
    contact,
}: {
    contact: EmerengyDocData;
}) {
    const { colors } = useTheme();

    return (
        <View
            className="flex-1 flex-col items-center justify-between p-4 rounded-xl shadow-md border my-2"
            style={{
                backgroundColor: colors.surface,
                borderColor: colors.muted,
                elevation: 2,
            }}
        >
            <Feather name="phone" size={24} color={colors.primary} />
            <Text style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}>
                {contact.name}
            </Text>
            <Text
                className="tracking-wider mt-1 text-lg"
                style={{
                    fontFamily: Platform.select({
                        ios: "Menlo",
                        android: "monospace",
                    }),
                    color: colors.muted,
                }}
            >
                {contact.phone}
            </Text>
            <TouchableOpacity
                className="w-full flex-row items-center justify-center gap-3 bg-green-500 py-3 rounded-lg"
                onPress={() => Linking.openURL(`tel:${contact.phone}`)}
            >
                <Text className="text-white"
                    style={{ fontFamily: FONTS_CONSTANTS.bold }}
                >
                    اتصال مباشر
                </Text>
            </TouchableOpacity>
        </View>
    );
}
