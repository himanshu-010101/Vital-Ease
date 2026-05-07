import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export const getDashboardAnalytics = async () => {
    try {
        const response = await api.get('/analytics/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};
