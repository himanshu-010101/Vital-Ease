import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const createContact = async ({ fname, lname, phone, email, message }) => {
    try {
        const response = await api.post("/contact/create", { fname, lname, phone, email, message });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getContacts = async () => {
    try {
        const response = await api.get("/contact");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContact = async (id) => {
    try {
        const response = await api.delete(`/contact/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateContact = async (id, statusData) => {
    try {
        const response = await api.patch(`/contact/update-status/${id}`, statusData);
        return response.data;
    } catch (error) {
        throw error;
    }
}