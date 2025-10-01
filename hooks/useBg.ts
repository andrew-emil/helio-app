import { useTheme } from "@/context/themeContext";

export const useBg = () => {
    const { themeMode } = useTheme();

    const bg = (light: string, dark: string) => (themeMode === "light" ? light : dark);

    return { bg, themeMode };
};
