import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

export const getDashboardAnalytics = async () => {
    try {
        const response = await api.get('/analytics/stats')
        return response.data
    } catch (error) {
        throw error;
    }
};
