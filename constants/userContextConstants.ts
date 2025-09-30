export interface UserContextValue {
    isLoggedIn: boolean;
    user: UserData | null;
    isGuest: boolean;
    setGuest: (isGuest: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

export interface UserData {
    email: string ;
    username: string;
    uid: string;
    imageUrl: string;
}

export const USER_KEY_STORAGE = "user_data";