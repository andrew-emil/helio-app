// context/dataContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
    ServiceDocData,
    NewsDocData,
    AdvertisementsDocData,
    PropertyDocData,
} from "@/types/firebaseDocs.type";

const STORAGE_KEY = "appData_v1";

type State = {
    services: ServiceDocData[];
    news: NewsDocData[];
    advertisements: AdvertisementsDocData[];
    properties: PropertyDocData[];
    isLoaded: boolean;
};

const initialState: State = {
    services: [],
    news: [],
    advertisements: [],
    properties: [],
    isLoaded: false,
};

type Action =
    | { type: "SET_ALL"; payload: Partial<State> }
    | { type: "RESET" }
    | { type: "SET_LOADED" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_ALL":
            return { ...state, ...action.payload };
        case "RESET":
            return initialState;
        case "SET_LOADED":
            return { ...state, isLoaded: true };
        default:
            return state;
    }
}

type ContextValue = State & {
    saveInitialData: (payload: Partial<State>) => Promise<void>;
    resetData: () => Promise<void>;
};

const DataContext = createContext<ContextValue | undefined>(undefined);

/* ---------------------------
   Helpers: serialize / deserialize
   --------------------------- */

function serializeForStorage(s: State) {
    const toIso = (d?: Date) => (d instanceof Date ? d.toISOString() : d ?? null);

    return {
        services: s.services.map((x) => ({ ...x, createdAt: toIso(x.createdAt) })),
        news: s.news.map((x) => ({ ...x, createdAt: toIso(x.createdAt) })),
        advertisements: s.advertisements.map((x) => ({ ...x, createdAt: toIso(x.createdAt) })),
        properties: s.properties.map((x) => ({ ...x, createdAt: toIso(x.createdAt) })),
    };
}

function deserializeFromStorage(raw: any): State {

    const services: ServiceDocData[] = (raw?.services ?? []).map((x: any) => ({
        ...x,
        createdAt: x?.createdAt ? new Date(x.createdAt) : new Date(),
    }));

    const news: NewsDocData[] = (raw?.news ?? []).map((x: any) => ({
        ...x,
        createdAt: x?.createdAt ? new Date(x.createdAt) : new Date(),
    }));

    const advertisements: AdvertisementsDocData[] = (raw?.advertisements ?? []).map((x: any) => ({
        ...x,
        createdAt: x?.createdAt ? new Date(x.createdAt) : new Date(),
    }));

    const properties: PropertyDocData[] = (raw?.properties ?? []).map((x: any) => ({
        ...x,
        createdAt: x?.createdAt ? new Date(x.createdAt) : new Date(),
        images: Array.isArray(x?.images) ? x.images : [],
    }));

    return {
        services,
        news,
        advertisements,
        properties,
        isLoaded: true,
    };
}

/* ---------------------------
   Provider implementation
   --------------------------- */

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // load once
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                console.log("🔍 DataProvider: Attempting to load data...");
                const raw = await AsyncStorage.getItem(STORAGE_KEY);

                if (!raw) {
                    console.log("DataProvider: No stored data found");
                    if (mounted) dispatch({ type: "SET_LOADED" });
                    return;
                }

                const parsed = JSON.parse(raw);
                console.log("🔍 DataProvider: Raw data parsed, starting deserialization");
                const deserialized = deserializeFromStorage(parsed);

                if (mounted) {
                    dispatch({ type: "SET_ALL", payload: deserialized });
                    console.log("✅ DataProvider: Data loaded successfully", {
                        services: deserialized.services.length,
                        news: deserialized.news.length,
                    });
                }
            } catch (err) {
                console.error("❌ DataProvider: Failed to load stored data", err);
                // Consider a retry mechanism or setting default state here
            } finally {
                if (mounted) dispatch({ type: "SET_LOADED" });
            }
        })();

        return () => { mounted = false; };
    }, []);

    const saveInitialData = useCallback(async (payload: Partial<State>) => {
        try {
            console.log("🟦 [1] saveInitialData called");

            const merged: State = {
                services: payload.services ?? [],
                news: payload.news ?? [],
                advertisements: payload.advertisements ?? [],
                properties: payload.properties ?? [],
                isLoaded: true,
            };
            console.log("🟦 [2] State constructed");

            // Update in-memory state immediately
            dispatch({ type: "SET_ALL", payload: merged });
            console.log("🟦 [3] Dispatched to in-memory state");

            // Use the serializer for storage
            const serialized = serializeForStorage(merged);
            console.log("🟦 [4] Data serialized");

            // Save to AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
            console.log("✅ [5] Data successfully saved to AsyncStorage");

        } catch (err) {
            console.error("❌ [6] saveInitialData failed", err);
        }
    }, []);



    const resetData = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            dispatch({ type: "RESET" });
            console.log("DataProvider: storage cleared");
        } catch (err) {
            console.error("DataProvider: reset failed", err);
        }
    }, []);

    const value: ContextValue = {
        services: state.services,
        news: state.news,
        advertisements: state.advertisements,
        properties: state.properties,
        isLoaded: state.isLoaded,
        saveInitialData,
        resetData,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/* ---------------------------
   Hooks for consumer usage
   --------------------------- */

export const useData = (): ContextValue => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used within DataProvider");
    return ctx;
};
