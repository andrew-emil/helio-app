// DataProvider.tsx
import type { Advertisement, DataContextType, Property } from '@/types/dataContext.type';
import type { AdvertisementsDocData, NewsDocData, PropertyDocData, ServiceDocData } from '@/types/firebaseDocs.type';
import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { useToast } from './toastContext';

type MaybeId = { id?: string };
type GenericSet<T> = React.Dispatch<React.SetStateAction<T[]>>;

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside DataProvider");
    return ctx;
};

const genId = (): string => {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) return (crypto as any).randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();

    const [services, setServices] = useState<ServiceDocData[]>([]);
    const [news, setNews] = useState<NewsDocData[]>([]);
    const [advertisements, setAdvertisements] = useState<AdvertisementsDocData[]>([]);
    const [properties, setProperties] = useState<PropertyDocData[]>([]);

    // genericSave / genericDelete unchanged (kept for CRUD usage)
    const genericSave = useCallback(<T extends MaybeId>(
        setItems: GenericSet<T>,
        newItemData: Partial<T> & { id?: string },
        itemName: string,
        successMessage?: string
    ) => {
        let didUpdate = false;

        setItems(prev => {
            if (newItemData.id) {
                const updated = prev.map(item =>
                    // @ts-ignore
                    item.id === newItemData.id
                        ? { ...item, ...newItemData, updatedAt: new Date().toISOString() }
                        : item
                );
                didUpdate = true;
                return updated;
            }

            const newItem: T = {
                ...(newItemData as T),
                id: genId(),
                // @ts-ignore
                createdAt: new Date().toISOString(),
                // @ts-ignore
                updatedAt: new Date().toISOString(),
            } as T;

            didUpdate = false;
            console.log(`Added new ${itemName}:`, newItem.id);
            return [newItem, ...prev];
        });

        if (didUpdate) {
            showToast(successMessage || `تم تحديث ${itemName} بنجاح`);
        } else {
            showToast(successMessage || `تمت إضافة ${itemName} بنجاح`);
        }
    }, [showToast]);

    const genericDelete = useCallback(<T extends { id: string }>(
        setItems: GenericSet<T>,
        itemId: string,
        itemName: string
    ) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        showToast(`تم حذف ${itemName} بنجاح`);
    }, [showToast]);

    // ---- Handlers for services ----
    const handleSaveService = useCallback((service: Partial<ServiceDocData> & { id?: string }) => {
        genericSave<ServiceDocData>(setServices, service, 'الخدمة');
    }, [genericSave]);

    const handleDeleteService = useCallback((serviceId: string) => {
        genericDelete(setServices, serviceId, 'الخدمة');
    }, [genericDelete]);

    // ---- Handlers for news ----
    const handleSaveNews = useCallback((newsItem: Partial<NewsDocData> & { id?: string }) => {
        genericSave<NewsDocData>(setNews, newsItem, 'الخبر');
    }, [genericSave]);

    const handleDeleteNews = useCallback((newsId: string) => {
        genericDelete(setNews, newsId, 'الخبر');
    }, [genericDelete]);

    // ---- Handlers for advertisements ----
    const handleSaveAdvertisement = useCallback((ad: Partial<Advertisement> & { id?: string }) => {
        genericSave<AdvertisementsDocData>(setAdvertisements, ad, 'الإعلان');
    }, [genericSave]);

    const handleDeleteAdvertisement = useCallback((adId: string) => {
        genericDelete(setAdvertisements, adId, 'الإعلان');
    }, [genericDelete]);

    // ---- Handlers for properties ----
    const handleSaveProperty = useCallback((property: Partial<Property> & { id?: string }) => {
        genericSave<PropertyDocData>(setProperties, property, 'العقار');
    }, [genericSave]);

    const handleDeleteProperty = useCallback((propertyId: string) => {
        genericDelete(setProperties, propertyId, 'العقار');
    }, [genericDelete]);

    // ---------------------------
    // NEW: saveInitialData - set all arrays in one shot
    // Accepts the entire payload and returns a Promise that resolves after a microtask.
    // This is intended for initial bulk loading (from your splash screen).
    // ---------------------------
    const saveInitialData = useCallback(async (payload: {
        services?: ServiceDocData[];
        news?: NewsDocData[];
        advertisements?: AdvertisementsDocData[];
        properties?: PropertyDocData[];
    }) => {
        // Normalize missing arrays to empty arrays
        const s = payload.services ?? [];
        const n = payload.news ?? [];
        const a = payload.advertisements ?? [];
        const p = payload.properties ?? [];

        // Update state in one go (multiple setState calls — React will batch these)
        setServices(s);
        setNews(n);
        setAdvertisements(a);
        setProperties(p);

        // Wait a tick to give React a chance to schedule renders / updates.
        // If you need stronger guarantees, bump the delay slightly.
        await new Promise<void>((res) => setTimeout(() => res(), 0));
    }, []);

    const value: DataContextType = {
        services,
        news,
        advertisements,
        properties,

        handleSaveService,
        handleSaveNews,
        handleSaveAdvertisement,
        handleSaveProperty,

        handleDeleteService,
        handleDeleteNews,
        handleDeleteAdvertisement,
        handleDeleteProperty,

        // exported new method
        saveInitialData,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
