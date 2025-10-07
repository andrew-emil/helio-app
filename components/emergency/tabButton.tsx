import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const TabEmergencyButton: React.FC<{
    active: boolean;
    onPress: () => void;
    children: React.ReactNode;
    count: number;
}> = ({ active, onPress, children, count }) => {
    const { themeMode, colors } = useTheme();


    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, {
                backgroundColor: active ? "#06b6d4" : colors.muted
            }]}
        >
            <Text
                style={{
                    fontFamily: FONTS_CONSTANTS.semiBold,
                    color: active ? "#ffffff" : (themeMode === "light" ? "#4b5563" : "#d1d5db"),
                }}
            >
                {children}
            </Text>
            <Text
                className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-white text-cyan-600" : "bg-slate-300 text-gray-600"
                    }`}
                style={{ fontFamily: FONTS_CONSTANTS.regular }}
            >
                {count}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,

    }
})