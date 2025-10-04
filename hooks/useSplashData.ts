
import { getAllAdvertisements } from '@/services/firebase/advertisments';
import { getAllNews } from '@/services/firebase/news';
import { getAllProperties } from '@/services/firebase/properties';
import { fetchAllServices, ServicesByCategory } from '@/services/firebase/services';
import type {
    AdvertisementsDocData,
    NewsDocData,
    PropertyDocData,
    ServiceDocData
} from '@/types/firebaseDocs.type';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

type RawPayload = {
    services: ServicesByCategory | ServiceDocData[];
    news: NewsDocData[];
    advertisements: AdvertisementsDocData[];
    properties: PropertyDocData[];
};

export type SplashPayload = {
    services: ServiceDocData[];
    news: NewsDocData[];
    advertisements: AdvertisementsDocData[];
    properties: PropertyDocData[];
};

export function useSplashData() {
    const selectFn = useCallback((data: RawPayload): SplashPayload => {
        const flatServices: ServiceDocData[] = [];

        const { services } = data;
        if (Array.isArray(services)) {
            flatServices.push(...services);
        } else if (services && typeof services === 'object') {

            Object.values(services).forEach(subcats => {
                if (!Array.isArray(subcats)) return;
                subcats.forEach((subcat: any) => {
                    const arr = Array.isArray(subcat?.services) ? subcat.services : [];
                    arr.forEach((s: ServiceDocData) => flatServices.push(s));
                });
            });
        }

        return {
            services: flatServices,
            news: data.news ?? [],
            advertisements: data.advertisements ?? [],
            properties: data.properties ?? [],
        };
    }, []);

    return useQuery<RawPayload, Error, SplashPayload>({
        queryKey: ['splash-screen'],
        queryFn: async (): Promise<RawPayload> => {
            const [services, news, advertisements, properties] = await Promise.all([
                fetchAllServices(),
                getAllNews(),
                getAllAdvertisements(),
                getAllProperties(),
            ]);
            return { services, news, advertisements, properties };
        },
        select: selectFn,
        staleTime: 1000 * 60 * 5,
    });
}
