import { useContext } from 'react';
import { UserAuthContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { userRegister, userLogin, userLogout, getUser, deleteUser, getAllUsers } from '../services/userAuth.api';

export const useUserAuth = () => {

    const context = useContext(UserAuthContext);
    const { user, setUser, loading, setLoading, detailedUser, setDetailedUser, isDataLoading, setIsDataLoading, allUsers, setAllUsers } = context;

    const handleUserRegister = async ({ fname, lname, email, phone, age, gender, dob, address, userName, password }) => {
        setLoading(true);
        try {
            const data = await userRegister({ fname, lname, email, phone, age, gender, dob, address, userName, password });
            if (data && data.error) {
                toast.error(data.error);
                return { error: data.error };
            }
            setUser(data.user);
            toast.success('Register successfully');
            return { success: true };
        } catch (err) {
            let message = err && err.message ? err.message : 'Registration failed.';
            toast.error(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const handleUserLogin = async ({ userName, password }) => {
        setLoading(true);
        try {
            const data = await userLogin({ userName, password });
            if (data?.user) {
                setUser(data.user);
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

    const handleGetUser = async () => {
        setIsDataLoading(true);
        try {
            const data = await getUser();
            if (data?.user) {
                setDetailedUser(data.user);
                return data.user;
            }
            return null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        } finally {
            setIsDataLoading(false);
        }
    };

    const handleUserLogout = async () => {
        setLoading(true);
        try {
            await userLogout();
            setUser(null);
            setDetailedUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        setLoading(true);
        try {
            const data = await deleteUser(id);
            if (data?.success) {
                setAllUsers(prev => prev.filter(user => user._id !== id));
                toast.success('User deleted successfully');
                return { success: true };
            }
            toast.error(data?.message || "Failed to delete user");
            return { error: data?.message || "Failed to delete user" };
        } catch (error) {
            toast.error(error?.message || "An error occurred during deletion.");
            return { error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllUsers = async () => {
        setIsDataLoading(true);
        try {
            const data = await getAllUsers();
            if (data?.users) {
                setAllUsers(data.users);
                return data.users;
            }
            return null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        } finally {
            setIsDataLoading(false);
        }
    };

    return {
        user,
        loading,
        isDataLoading,
        detailedUser,
        allUsers,
        handleUserRegister,
        handleUserLogin,
        handleUserLogout,
        handleGetUser,
        handleDeleteUser,
        handleGetAllUsers
    }
}