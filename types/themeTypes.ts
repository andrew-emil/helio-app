import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";

export type ThemeMode = typeof LIGHT_THEME | typeof DARK_THEME;

export interface ThemeColors {
    background: string;
    headerColor: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    iconColor: string;
}

export interface ThemeContextValue {
    themeMode: ThemeMode;
    colors: ThemeColors;
    toggleTheme: () => void;
    isReady: boolean;
}