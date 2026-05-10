import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const createServProg = async (data) => {
    try {
        const response = await api.post("/serv_prog/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating service or programme:", error);
        throw error;
    }
}

export const getAllServProg = async () => {
    try {
        const response = await api.get("/serv_prog");
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching services or programmes:", error);
        throw error;
    }
}

export const deleteServProg = async (id) => {
    try {
        const response = await api.delete(`/serv_prog/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting service or programme:", error);
        throw error;
    }
}