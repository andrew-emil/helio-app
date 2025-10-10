import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "expo-router"; // or useNavigation if using react-navigation
import React from "react";
import { Pressable, Text, View } from "react-native";

type QuickAccessCardProps = {
    icon: React.ReactNode;
    title: string;
    to: string;
};

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ icon, title, to }) => {
    const router = useRouter();
    const { colors, themeMode } = useTheme()
    console.log(to)

    return (
        <Pressable
            onPress={() => router.push(`${to}` as any)}
            className="flex flex-col items-center justify-center p-4 rounded-xl shadow-lg text-center w-40"
            style={{
                backgroundColor: colors.surface
            }
            }
        >
            <View className="flex items-center justify-center w-14 h-14 rounded-full mb-3"
                style={{ backgroundColor: themeMode === 'light' ? "#cffafe" : 'rgb(22 78 99 / 0.5)' }}>
                {icon}
            </View>
            <Text className="text-sm"
                style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
            >
                {title}
            </Text>
        </Pressable>
    );
};

export default QuickAccessCard;
