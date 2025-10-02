import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useBg } from "@/hooks/useBg";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
    children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, children }) => {
    const { bg } = useBg()
    const {colors} = useTheme()

    return (
        <View className={`text-center py-16 px-6 ${bg("bg-slate-50", "bg-slate-800/50")} rounded-lg items-center`}>
            {/* Icon wrapper */}
            <View className={`flex items-center justify-center h-16 w-16 rounded-full ${bg(" bg-slate-200", "bg-slate-700")}`}>
                {icon}
            </View>

            {/* Title */}
            <Text className="mt-4 text-xl text-center"
            style={{color: colors.text, fontFamily: FONTS_CONSTANTS.semiBold}}>
                {title}
            </Text>

            {/* Message */}
            <Text className="mt-2 text-base text-center"
            style={{fontFamily: FONTS_CONSTANTS.regular, color: colors.muted}}>
                {message}
            </Text>

            {/* Children (e.g., button, link) */}
            {children && <View className="mt-6">{children}</View>}
        </View>
    );
};

export default EmptyState;
