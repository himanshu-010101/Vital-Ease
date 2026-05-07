import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const getApprovedDoctors = async () => {
    try {
        const response = await api.get("/approved-doctors/all-approved-doctors");
        return response.data;
    } catch (error) {
        console.error("Error fetching approved doctors:", error);
        throw error;
    }
}

export const toggleDoctorDisplay = async (id) => {
    try {
        const response = await api.patch(`/approved-doctors/toggle-display/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error toggling doctor display:", error);
        throw error;
    }
}

export const approveDoctor = async (id) => {
    try {
        const response = await api.post(`/approved-doctors/approve/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error approving doctor:", error);
        throw error;
    }
}

export const doctorLogin = async ({userName, password}) => {
    try {
        const response = await api.post("/approved-doctors/login", { userName, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export const doctorLogout = async () => {
    try {
        const response = await api.get("/approved-doctors/logout");
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}   

export const deleteApprovedDoctor = async (id) => {
    try {
        const response = await api.delete(`/approved-doctors/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting doctor:", error);
        throw error;
    }
}