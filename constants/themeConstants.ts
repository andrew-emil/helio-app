import { ThemeColors } from "@/types/themeTypes";

const THEME_KEY_STORAGE = "theme";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";

const LIGHT_COLORS: ThemeColors = {
    background: "#F1F5F9",
    headerColor: "#FCFDFE",
    surface: "#FFFFFF",
    primary: "#008080",
    accent: "#D81E5B",
    text: "#000000",
    iconColor: "#4B5563",
}

const DARK_COLORS: ThemeColors = {
    background: "#0F172A",
    headerColor: "#1B2637",
    surface: "#1e293b",
    primary: "#4DB6AC",
    accent: "#EF5350",
    text: "#FFFFFF",
    iconColor: "#696969",
}

export {
    DARK_COLORS, DARK_THEME,
    LIGHT_COLORS, LIGHT_THEME, THEME_KEY_STORAGE
};
