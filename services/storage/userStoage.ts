import { USER_KEY_STORAGE } from '@/constants/userContextConstants';
import { UserData } from '@/types/userContext.type';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserStorage = {
    getUserData: async (): Promise<{ user: UserData | null; isGuest: boolean }> => {
        const userDataString = await AsyncStorage.getItem(USER_KEY_STORAGE);
        if (userDataString) {
            return JSON.parse(userDataString);
        }
        return { user: null, isGuest: true };
    },

    setUserData: async (user: UserData | null, isGuest: boolean) => {
        try {
            const userData = { user, isGuest };
            await AsyncStorage.setItem(USER_KEY_STORAGE, JSON.stringify(userData))
            return user
        } catch (error) {
            console.error("Error saving user data to storage", error);
        }
    },

    clearUserData: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(USER_KEY_STORAGE);
        } catch (error) {
            console.error("Error clearing user data from storage", error);
        }
    }
}