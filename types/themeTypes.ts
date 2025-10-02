import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";

export type ThemeMode = typeof LIGHT_THEME | typeof DARK_THEME | "system";

export interface ThemeColors {
    background: string;
    headerColor: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    iconColor: string;
    muted: string;
    error: string
}

export interface ThemeContextValue {
    themeMode: ThemeMode;
    colors: ThemeColors;
    setTheme: (mode: ThemeMode) => Promise<void>;
    isReady: boolean;
}