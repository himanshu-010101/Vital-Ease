import { useContext } from 'react';
import { AdminContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { adminLogin, adminLogout } from '../services/adminAuth.api';

export const useAdminAuth = () => {
    const context = useContext(AdminContext);
    const { admin, setAdmin, loading, setLoading } = context;

    const handleAdminLogin = async ({ userName, password }) => {
        setLoading(true);
        try {
            const data = await adminLogin({ userName, password });
            if (data?.admin) {
                setAdmin(data.admin);
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

    const handleAdminLogout = async () => {
        setLoading(true);
        try {
            await adminLogout();
            setAdmin(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        admin,
        loading,
        handleAdminLogin,
        handleAdminLogout
    }
}