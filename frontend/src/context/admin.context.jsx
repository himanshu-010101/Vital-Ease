import { useState, useEffect } from 'react';
import { AdminContext } from './create.context';
import { getAdmin } from '../services/adminAuth.api';
import { getDashboardAnalytics } from '../services/analytics.api';

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);

    const handleFetchAnalytics = async () => {
        try {
            const data = await getDashboardAnalytics();
            if (data?.success) {
                setAnalyticsData(data);
            }
        } catch (error) {
            console.error("Analytics fetch error:", error);
        }
    };

    useEffect(() => {
        async function fetchAdmin() {
            setLoading(true);
            try {
                const data = await getAdmin();
                if (data?.admin) {
                    setAdmin(data.admin);
                }
            } catch (error) {
                // If the error is 403 (Forbidden) or 401 (Unauthorized), 
                // it just means the current user is not an admin. 
                // We don't need to log this as an error.
                if (error.response?.status !== 403 && error.response?.status !== 401) {
                    console.error("Admin session error:", error);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchAdmin();
    }, []);

    return (
        <AdminContext.Provider value={{ admin, setAdmin, loading, setLoading, analyticsData, handleFetchAnalytics }}>
            {children}
        </AdminContext.Provider>
    );
};