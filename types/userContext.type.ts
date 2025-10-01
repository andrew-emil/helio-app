export interface UserContextValue {
    isLoggedIn: boolean;
    user: UserData | null;
    setUser: (user: UserData) => void;
    isGuest: boolean;
    setGuest: (isGuest: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

export interface UserData {
    email: string;
    username: string;
    uid: string;
    imageUrl: string;
    createdAt?: Date;
}