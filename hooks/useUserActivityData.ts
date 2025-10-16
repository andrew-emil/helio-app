import { useState, useEffect } from 'react';
import { fetchUserActivityData } from '../services/firebase/dashboard';
import type { UserActivityData } from '../services/firebase/dashboard';

interface UseUserActivityDataReturn {
    data: UserActivityData[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useUserActivityData(): UseUserActivityDataReturn {
    const [data, setData] = useState<UserActivityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const userActivityData = await fetchUserActivityData();
            setData(userActivityData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
}
