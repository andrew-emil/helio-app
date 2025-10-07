// FavStorage.ts
import { FAVORITE_STORAGE_KEY } from "@/constants/favoriteConstants";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Local favorites storage helper using AsyncStorage.
 * All functions return the updated favorites array or a boolean where appropriate.
 */
export const FavStorage = {
    getFavorites: async (): Promise<ServiceDocData[]> => {
        try {
            const raw = await AsyncStorage.getItem(FAVORITE_STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw) as ServiceDocData[];

            // If you need Date objects for createdAt:
            parsed.forEach(p => { if (p.createdAt && typeof p.createdAt === "string") p.createdAt = new Date(p.createdAt); });

            return parsed;
        } catch (err) {
            console.error("FavStorage.getFavorites error:", err);
            return [];
        }
    },

    addToFavorites: async (service: ServiceDocData): Promise<ServiceDocData[]> => {
        try {
            const favorites = await FavStorage.getFavorites();
            const exists = favorites.some((s) => s.id === service.id);
            if (exists) return favorites;
            const updated = [service, ...favorites];
            await AsyncStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        } catch (err) {
            console.error("FavStorage.addToFavorites error:", err);
            return [];
        }
    },

    removeFromFavorites: async (serviceId: string): Promise<ServiceDocData[]> => {
        try {
            const favorites = await FavStorage.getFavorites();
            const updated = favorites.filter((s) => s.id !== serviceId);
            await AsyncStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        } catch (err) {
            console.error("FavStorage.removeFromFavorites error:", err);
            return [];
        }
    },

    clearFavorites: async (): Promise<ServiceDocData[]> => {
        try {
            await AsyncStorage.removeItem(FAVORITE_STORAGE_KEY);
            return [];
        } catch (err) {
            console.error("FavStorage.clearFavorites error:", err);
            return [];
        }
    },

    isFavorite: async (serviceId: string): Promise<boolean> => {
        try {
            const favorites = await FavStorage.getFavorites();
            return favorites.some((s) => s.id === serviceId);
        } catch (err) {
            console.error("FavStorage.isFavorite error:", err);
            return false;
        }
    },

    /**
     * Toggle favorite for a service.
     * Returns { updated: ServiceDocData[], isFavorite: boolean }
     */
    toggleFavorite: async (service: ServiceDocData): Promise<{ updated: ServiceDocData[]; isFavorite: boolean }> => {
        try {
            const favorites = await FavStorage.getFavorites();
            const exists = favorites.some((s) => s.id === service.id);

            if (exists) {
                const updated = favorites.filter((s) => s.id !== service.id);
                await AsyncStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(updated));
                return { updated, isFavorite: false };
            } else {
                const updated = [service, ...favorites];
                await AsyncStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(updated));
                return { updated, isFavorite: true };
            }
        } catch (err) {
            console.error("FavStorage.toggleFavorite error:", err);
            return { updated: [], isFavorite: false };
        }
    },
};
