import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const getAllDepartments = async () => {
    try {
        const response = await api.get("/department/all");
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message };
    }
}

export const createDepartment = async (name) => {
    try {
        const response = await api.post("/department/create", { name });
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message };
    }
}

export const deleteDepartment = async (id) => {
    try {
        const response = await api.delete(`/department/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message };
    }
}