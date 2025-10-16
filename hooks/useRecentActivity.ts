import { useState, useEffect } from 'react';
import { fetchRecentActivity } from '../services/firebase/dashboard';
import type { RecentActivity } from '../services/firebase/dashboard';

interface UseRecentActivityReturn {
    activities: RecentActivity[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useRecentActivity(): UseRecentActivityReturn {
    const [activities, setActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const recentActivities = await fetchRecentActivity();
            setActivities(recentActivities);
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
        activities,
        loading,
        error,
        refetch: fetchData
    };
}
