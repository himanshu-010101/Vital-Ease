import { useContext } from 'react';
import { DoctorAuthContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { doctorRegister, doctorLogin, doctorLogout, getDoctor, getAllPendingDoctors, deletePendingDoctor } from '../services/doctorAuth.api';

export const useDoctorAuth = () => {
    const context = useContext(DoctorAuthContext);
    const { doctor, setDoctor, loading, setLoading, detailedDoctor, setDetailedDoctor, isDataLoading, setIsDataLoading } = context;

    const handleDoctorRegister = async ({ fname, lname, email, phone, age, gender, file, specialization, userName, password }) => {
        setLoading(true);
        try {
            const data = await doctorRegister({ fname, lname, email, phone, age, gender, file, specialization, userName, password });
            if (data && data.error) {
                toast.error(data.error);
                return { error: data.error };
            }
            setDoctor(data.doctor);
            toast.success('We will contact you soon');
            return { success: true };
        } catch (err) {
            let message = err && err.message ? err.message : 'Registration failed.';
            toast.error(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const handleDoctorLogin = async ({ userName, password }) => {
        setLoading(true);
        try {
            const data = await doctorLogin({ userName, password });
            if (data?.doctor) {
                // Fetch full professional details to ensure first-render consistency
                const fullDoctorRes = await getDoctor();
                const fullDoctorData = fullDoctorRes?.doctor || data.doctor;

                setDoctor(fullDoctorData);
                setDetailedDoctor(fullDoctorData);
                toast.success('Logged in successfully');
                return { success: true };
            }
            toast.error(data?.message || "Invalid credentials");
            return { error: data?.message || "Invalid credentials" };
        } catch (error) {
            toast.error(error?.message || "An error occurred during login.");
            return { error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const handleDoctorLogout = async () => {
        setLoading(true);
        try {
            await doctorLogout();
            setDoctor(null);
            setDetailedDoctor(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllPendingDoctors = async () => {
        setIsDataLoading(true);
        try {
            const data = await getAllPendingDoctors();
            if (data?.doctors) {
                return { success: true, doctors: data.doctors };
            }
            return { success: false, doctors: [] };
        } catch (error) {
            console.error('Get pending doctors error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsDataLoading(false);
        }
    };

    const handleGetDoctor = async () => {
        setIsDataLoading(true);
        try {
            const data = await getDoctor();
            if (data?.doctor) {
                setDetailedDoctor(data.doctor);
                return data.doctor;
            }
            return null;
        } catch (error) {
            console.error('Get doctor error:', error);
            return null;
        } finally {
            setIsDataLoading(false);
        }
    };

    const handleDeletePendingDoctor = async (id) => {
        setIsDataLoading(true);
        try {
            const data = await deletePendingDoctor(id);
            if (data?.success || data?.message === "Doctor registration deleted successfully.") {
                toast.success("Registration removed");
                return { success: true };
            }
            return { success: false, message: data?.message };
        } catch (error) {
            console.error('Delete pending doctor error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsDataLoading(false);
        }
    };


    return {
        doctor,
        loading,
        isDataLoading,
        detailedDoctor,
        handleDoctorRegister,
        handleDoctorLogin,
        handleDoctorLogout,
        handleGetAllPendingDoctors,
        handleGetDoctor,
        handleDeletePendingDoctor
    }
}
