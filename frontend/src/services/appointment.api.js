import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

// Patient: Create New Appointment
export async function createAppointment({ departmentId, appointmentDate, timeSlot, symptoms, visitType }) {
    try {
        const res = await api.post("/appoint/create", { departmentId, appointmentDate, timeSlot, symptoms, visitType });
        return { success: true, info: res.data.appointment };
    }
    catch (error) {
        return { error: error.response?.data?.message || "Failed to create appointment." };
    }
}

export const getUserAppointments = async () => {
    try {
        const response = await api.get("/appoint/user-appointments");
        return { success: true, appointments: response.data.appointments };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to fetch your appointments." };
    }
}

export const deleteUserAppointment = async (appointmentId) => {
    try {
        const response = await api.delete(`/appoint/user/delete/${appointmentId}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to delete appointment." };
    }
}

// Admin: Get All Appointments
export const getAllAppointments = async () => {
    try {
        const response = await api.get("/appoint/all");
        return { success: true, appointments: response.data.appointments };
    } catch (error) {
        return { error: error.response?.data?.message || "Access denied or server error." };
    }
}

// Admin: Assign Doctor to Appointment
export const assignDoctor = async (appointmentId, doctorId) => {
    try {
        const response = await api.patch(`/appoint/assign/${appointmentId}`, { doctorId });
        return { success: true, message: response.data.message };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to assign doctor." };
    }
}

export const deleteAppointment = async (appointmentId) => {
    try {
        const response = await api.delete(`/appoint/delete/${appointmentId}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to delete appointment." };
    }
}

// Doctor: Specific APIs
export const getDoctorAppointments = async () => {
    try {
        const response = await api.get("/appoint/doctor-appointments");
        return { success: true, appointments: response.data.appointments };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to fetch appointments." };
    }
}

export const getDoctorStats = async () => {
    try {
        const response = await api.get("/appoint/doctor/stats");
        return { success: true, stats: response.data.stats };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to fetch stats." };
    }
}

export const updateDoctorAppointmentStatus = async (appointmentId, status) => {
    try {
        const response = await api.patch(`/appoint/doctor/status/${appointmentId}`, { status });
        return { success: true, message: response.data.message, appointment: response.data.appointment };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to update status." };
    }
}

export const doctorEditAppointment = async (appointmentId, appointmentDate, timeSlot) => {
    try {
        const response = await api.patch(`/appoint/doctor/edit/${appointmentId}`, { appointmentDate, timeSlot });
        return { success: true, message: response.data.message, appointment: response.data.appointment };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to reschedule appointment." };
    }
}

export const doctorDeleteAppointment = async (appointmentId) => {
    try {
        const response = await api.delete(`/appoint/doctor/delete/${appointmentId}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to delete appointment." };
    }
}