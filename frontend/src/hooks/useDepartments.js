import { useContext } from 'react';
import { DepartmentContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { getAllDepartments, createDepartment, deleteDepartment } from '../services/department.api';

export const useDepartments = () => {
    const context = useContext(DepartmentContext);
    const { departments, setDepartments, loading, setLoading } = context;

    const handleGetAllDepartments = async () => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            if (data?.departments) {
                setDepartments(data.departments);
                return data;
            }
            toast.error("Failed to fetch departments");
            return null;
        } catch (error) {
            toast.error("Failed to fetch departments");
            console.error('Get departments error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDepartment = async (name) => {
        setLoading(true);
        try {
            const data = await createDepartment(name);
            if (data?.success || data?.message === "Department created successfully") {
                toast.success("Department created successfully");
                await handleGetAllDepartments(); // Refresh list
                return { success: true };
            }
            toast.error(data?.message || "Failed to create department");
            return { success: false, message: data?.message };
        } catch (error) {
            toast.error("An error occurred during creation");
            console.error('Create department error:', error);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartment = async (id) => {
        setLoading(true);
        try {
            const data = await deleteDepartment(id);
            if (data?.success || data?.message === "Department deleted successfully") {
                toast.success("Department deleted successfully");
                await handleGetAllDepartments(); // Refresh list
                return { success: true };
            }
            toast.error(data?.message || "Failed to delete department");
            return { success: false, message: data?.message };
        } catch (error) {
            toast.error("An error occurred during deletion");
            console.error('Delete department error:', error);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        departments,
        loading,
        handleGetAllDepartments,
        handleCreateDepartment,
        handleDeleteDepartment
    }
}