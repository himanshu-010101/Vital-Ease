import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const adminLogin = async ({ userName, password }) => {
    const response = await api.post('/admin/login', { userName, password });
    return response.data;
}

export const adminLogout = async () => {
    const response = await api.get('/admin/logout');
    return response.data;
}

export const getAdmin = async () => {
    const response = await api.get('/admin/getAdmin');
    return response.data;
}