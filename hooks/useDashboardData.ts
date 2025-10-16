import { useEffect, useState } from 'react';
import { DashboardData, fetchDashboardData } from '../services/firebase/dashboard';

interface UseDashboardDataReturn {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const dashboardData = await fetchDashboardData();
            setData(dashboardData);
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
