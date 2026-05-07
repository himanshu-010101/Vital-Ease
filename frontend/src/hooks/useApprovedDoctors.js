import { useContext } from 'react';
import { ApprovedDoctorsContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { getApprovedDoctors, toggleDoctorDisplay, approveDoctor, doctorLogin, doctorLogout, deleteApprovedDoctor } from '../services/approvedDoctors.api';

export const useApprovedDoctors = () => {
    const { approvedDoctors, setApprovedDoctors, loading, setLoading } = useContext(ApprovedDoctorsContext);

    const handleGetApprovedDoctors = async () => {
        setLoading(true);
        try {
            const data = await getApprovedDoctors();
            const doctors = data?.doctors || data || [];
            setApprovedDoctors(doctors);
            return { success: true, doctors };
        } catch (error) {
            toast.error("Failed to fetch approved doctors");
            return { success: false, doctors: [] };
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDoctorDisplay = async (id) => {
        setLoading(true);
        try {
            const data = await toggleDoctorDisplay(id);
            toast.success(data.message);
            handleGetApprovedDoctors();
            return { success: true };
        } catch (error) {
            toast.error("Failed to toggle doctor display");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const handleApproveDoctor = async (id) => {
        setLoading(true);
        try {
            const data = await approveDoctor(id);
            toast.success(data.message);
            handleGetApprovedDoctors();
            return { success: true };
        } catch (error) {
            toast.error("Failed to approve doctor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteApprovedDoctor = async (id) => {
        setLoading(true);
        try {
            const data = await deleteApprovedDoctor(id);
            toast.success(data.message);
            handleGetApprovedDoctors();
            return { success: true };
        } catch (error) {
            toast.error("Failed to delete doctor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        approvedDoctors,
        loading,
        handleGetApprovedDoctors,
        handleToggleDoctorDisplay,
        handleApproveDoctor,
        handleDeleteApprovedDoctor
    };
};
