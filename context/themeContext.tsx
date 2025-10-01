import { DARK_COLORS, LIGHT_COLORS } from "@/constants/themeConstants";
import { ThemeStorage } from "@/services/storage/themeStorage";
import { ThemeColors, ThemeContextValue, ThemeMode } from "@/types/themeTypes";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Animated, Appearance } from "react-native";

const ThemeContext = createContext<ThemeContextValue>({
    themeMode: "light",
    colors: LIGHT_COLORS,
    setTheme: async (mode: ThemeMode) => { },
    isReady: false,
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>("light");
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await ThemeStorage.getTheme();
                if (storedTheme) {
                    setThemeMode(storedTheme);
                } else {
                    // Default to system if nothing is stored
                    setThemeMode("system");
                }
            } catch (error) {
                console.error("Error loading theme from storage", error);
            } finally {
                setIsReady(true);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (mode: ThemeMode) => {
        setThemeMode(mode);
        await ThemeStorage.setTheme(mode);
    };

    // Determine active colors (system support)
    const deviceScheme = Appearance.getColorScheme();
    const activeMode = themeMode === "system" ? deviceScheme || "light" : themeMode;
    const colors: ThemeColors = activeMode === "dark" ? DARK_COLORS : LIGHT_COLORS;

    // Animated gradient for loading text
    const animatedValue = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [animatedValue]);

    return (
        <ThemeContext.Provider value={{ themeMode, colors, setTheme, isReady }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
