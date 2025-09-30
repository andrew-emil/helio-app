import { UserContextValue, UserData } from "@/constants/userContextConstants";
import { UserStorage } from "@/services/storage/userStoage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const UserContext = createContext<UserContextValue>({
    isLoggedIn: false,
    user: null,
    isGuest: true,
    setGuest: async (guest: boolean) => { },
    logout: async () => { },
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [isGuest, setIsGuest] = useState<boolean>(true);

    const logout = async () => {
        try {
            await UserStorage.clearUserData()
            setIsLoggedIn(false);
            setUser(null)
            setIsGuest(true);
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    const setGuest = async (guest: boolean) => {
        setIsGuest(guest);
        if (guest) {
            setUser(null);
            setIsLoggedIn(false);
            await UserStorage.setUserData(null, true);
        } else {
            await UserStorage.setUserData(user, false);
        }
    }

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await UserStorage.getUserData();
                setUser(userData.user)
                setIsGuest(userData.isGuest);
                setIsLoggedIn(!!userData.user && !userData.isGuest);
            } catch (error) {
                console.error("Error loading user data from storage", error);
            }
        }
        loadUserData();
    }, [])

    return (
        <UserContext.Provider value={{ isLoggedIn, user, isGuest, setGuest, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);