import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function ThemeToggleButton() {
    const { colors, themeMode, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={{
                marginLeft: 10,
                padding: 6,
                borderRadius: 8,
            }}
            accessibilityLabel="Toggle theme"
        >
            <Ionicons
                name={themeMode === "dark" ? "sunny-outline" : "moon-outline"}
                size={22}
                color={colors.text}
            />
        </TouchableOpacity>
    );
}
