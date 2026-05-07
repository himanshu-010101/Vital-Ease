import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const adminLogin = async ({ userName, password }) => {
    try {
        const response = await api.post('/admin/login', { userName, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const adminLogout = async () => {
    try {
        const response = await api.get('/admin/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAdmin = async () => {
    try {
        const response = await api.get('/admin/getAdmin')
        return response.data
    } catch (error) {
        throw error
    }
}   