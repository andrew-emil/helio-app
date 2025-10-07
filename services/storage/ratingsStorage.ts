import { Review } from "@/types/review.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RATING_STORAGE_KEY = "ratings"

export const RatingsStorage = {
    getAllRatings: async (): Promise<Review[]> => {
        try {
            const raw = await AsyncStorage.getItem(RATING_STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw) as Review[];

            // If you need Date objects for createdAt:
            parsed.forEach(p => { if (p.createdAt && typeof p.createdAt === "string") p.createdAt = new Date(p.createdAt); });

            return parsed;
        } catch (err) {
            console.error("RatingsStorage.getAllRatings error:", err);
            return [];
        }
    },


    addRating: async (rating: Review): Promise<void> => {
        try {
            const myRatings = await RatingsStorage.getAllRatings()
            const updated = [rating, ...myRatings]
            await AsyncStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(updated))
            return
        } catch (err) {
            console.error("RatingsStorage.addRating error:", err);
            return;
        }

    }
}