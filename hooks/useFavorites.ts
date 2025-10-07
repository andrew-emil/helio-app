import { FavStorage } from "@/services/storage/favoriteStorage";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<ServiceDocData[]>([]);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        let mounted = true;
        (async () => {
            const favs = await FavStorage.getFavorites();
            if (!mounted) return;
            setFavorites(favs);
            setLoading(false);
        })();
        return () => { mounted = false; };
    }, []);

    const refresh = useCallback(async () => {
        const favs = await FavStorage.getFavorites();
        setFavorites(favs);
        return favs;
    }, []);

    const toggle = useCallback(async (service: ServiceDocData) => {
        const res = await FavStorage.toggleFavorite(service);
        setFavorites(res.updated);
        queryClient.invalidateQueries({ queryKey: ["favs"] });
        return res;
    }, [queryClient]);

    const clear = useCallback(async () => {
        await FavStorage.clearFavorites();
        queryClient.invalidateQueries({ queryKey: ["favs"] });
        setFavorites([]);
    }, [queryClient]);

    return { favorites, loading, refresh, toggle, clear };
};
