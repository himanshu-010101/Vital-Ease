import { useContext } from 'react';
import { AppointmentContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { getUserAppointments, getAllAppointments, createAppointment, assignDoctor, deleteAppointment, deleteUserAppointment } from '../services/appointment.api';

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    const { appointments, setAppointments, loading, setLoading } = context;

    const handleCreateAppointments = async ({ departmentId, appointmentDate, timeSlot, symptoms, visitType }) => {
        setLoading(true);
        try {
            const data = await createAppointment({ departmentId, appointmentDate, timeSlot, symptoms, visitType })
            if (data && data.error) {
                toast.error(data.error);
                return { error: data.error };
            }
            setAppointments(prev => [...prev, data.info])
            toast.success("Appointment booked successfully")
            return { success: true }
        } catch (err) {
            let message = err?.message || ' Failed to book an appointment.';
            toast.error(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    }

    const handleGetUserAppointments = async () => {
        setLoading(true);
        try {
            const res = await getUserAppointments();
            if (res && res.success) {
                setAppointments(res.appointments);
                return res;
            }
            toast.error(res.error || "Failed to fetch your appointments");
            return res;
        } catch (error) {
            return { error: "An unexpected error occurred" };
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllAppointments = async () => {
        setLoading(true);
        try {
            const res = await getAllAppointments();
            if (res && res.success) {
                setAppointments(res.appointments);
                return res;
            }
            toast.error(res.error || "Failed to fetch all appointments");
            return res;
        } catch (error) {
            return { error: "An unexpected error occurred" };
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDoctor = async (appointmentId, doctorId) => {
        setLoading(true);
        try {
            const res = await assignDoctor(appointmentId, doctorId);
            if (res && res.success) {
                toast.success(res.message || "Appointment forwarded successfully");
                await handleGetAllAppointments();
                return res;
            }
            toast.error(res.error || "Failed to assign doctor");
            return res;
        } catch (error) {
            toast.error("An unexpected error occurred");
            return { error: "An unexpected error occurred" };
        } finally {
            setLoading(false);
        }
    };

    const handleUserDeleteAppointment = async (appointmentId) => {
        setLoading(true);
        try {
            const res = await deleteUserAppointment(appointmentId);
            if (res && res.success) {
                toast.success(res.message || "Appointment deleted successfully");
                setAppointments(prev => prev.filter(app => app._id !== appointmentId));
                return res;
            }
            toast.error(res.error || "Failed to delete appointment");
            return res;
        } catch (error) {
            toast.error("An unexpected error occurred");
            return { error: "An unexpected error occurred" };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        setLoading(true);
        try {
            const res = await deleteAppointment(appointmentId);
            if (res && res.success) {
                toast.success(res.message || "Appointment deleted successfully");
                setAppointments(prev => prev.filter(app => app._id !== appointmentId));
                return res;
            }
            toast.error(res.error || "Failed to delete appointment");
            return res;
        } catch (error) {
            toast.error("An unexpected error occurred");
            return { error: "An unexpected error occurred" };
        } finally {
            setLoading(false);
        }
    };

    return {
        appointments,
        loading,
        handleGetUserAppointments,
        handleGetAllAppointments,
        handleCreateAppointments,
        handleAssignDoctor,
        handleDeleteAppointment,
        handleUserDeleteAppointment
    }
}