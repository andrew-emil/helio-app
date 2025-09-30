import { DARK_COLORS, LIGHT_COLORS } from "@/constants/themeConstants";
import { ThemeStorage } from "@/services/storage/themeStorage";
import { ThemeColors, ThemeContextValue, ThemeMode } from "@/types/themeTypes";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Animated } from "react-native";

const ThemeContext = createContext<ThemeContextValue>({
    themeMode: "light",
    colors: LIGHT_COLORS,
    toggleTheme: () => {},
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
                setThemeMode(storedTheme);
            } catch (error) {
                console.error("Error loading theme from storage", error);
            } finally {
                setIsReady(true);
            }
        }
        loadTheme();
    }, [])

    const toggleTheme = async () => {
        setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        await ThemeStorage.setTheme(themeMode === "light" ? "dark" : "light");
    };

    const colors: ThemeColors = themeMode === 'dark' ? DARK_COLORS : LIGHT_COLORS;

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
        <ThemeContext.Provider value={{ themeMode, colors, toggleTheme, isReady }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);