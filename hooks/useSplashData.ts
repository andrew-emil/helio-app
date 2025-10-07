import { getAllAdvertisements } from '@/services/firebase/advertisments';
import { getAllNews } from '@/services/firebase/news';
import { getAllProperties } from '@/services/firebase/properties';
import { fetchAllServicesGroupedArray, ServicesByCategoryArray } from '@/services/firebase/services';
import type {
    AdvertisementsDocData,
    NewsDocData,
    PropertyDocData,
    ServiceDocData
} from '@/types/firebaseDocs.type';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

type RawPayload = {
    services: ServicesByCategoryArray | ServiceDocData[];
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
        console.log('🔄 useSplashData: Starting to transform data...');

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

        const result = {
            services: flatServices,
            news: data.news ?? [],
            advertisements: data.advertisements ?? [],
            properties: data.properties ?? [],
        };

        console.log('✅ useSplashData: Data transformation completed', {
            services: result.services.length,
            news: result.news.length,
            advertisements: result.advertisements.length,
            properties: result.properties.length,
        });

        return result;
    }, []);

    return useQuery<RawPayload, Error, SplashPayload>({
        queryKey: ['splash-screen'],
        queryFn: async (): Promise<RawPayload> => {
            console.log('🔥 useSplashData: Starting Firebase data fetch...');
            try {
                const [services, news, advertisements, properties] = await Promise.all([
                    fetchAllServicesGroupedArray(),
                    getAllNews(),
                    getAllAdvertisements(),
                    getAllProperties(),
                ]);

                console.log('✅ useSplashData: Firebase data fetched successfully', {
                    services: services?.length || 0,
                    news: news?.length || 0,
                    advertisements: advertisements?.length || 0,
                    properties: properties?.length || 0,
                });

                return {
                    services: services || [],
                    news: news || [],
                    advertisements: advertisements || [],
                    properties: properties || []
                };
            } catch (error) {
                console.error('❌ useSplashData: Firebase data fetch failed', error);
                // Return empty arrays as fallback
                return { services: [], news: [], advertisements: [], properties: [] };
            }
        },
        select: selectFn,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2, // Retry failed requests twice
        retryDelay: 1000, // Wait 1 second between retries
    });
}