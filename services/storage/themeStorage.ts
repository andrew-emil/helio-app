import { THEME_KEY_STORAGE } from '@/constants/themeConstants';
import { ThemeMode } from '@/types/themeTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeStorage = {
    getTheme: async (): Promise<ThemeMode> => {
        const theme = await AsyncStorage.getItem(THEME_KEY_STORAGE);
        return (theme as ThemeMode) || "light";
    },

    setTheme: async (theme: ThemeMode): Promise<void> => {
        try {
            await AsyncStorage.setItem(THEME_KEY_STORAGE, theme);
        } catch (error) {
            console.error("Error saving theme to storage", error);
        }
    }
}