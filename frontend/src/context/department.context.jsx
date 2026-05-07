import { useState, useEffect } from 'react';
import { DepartmentContext } from './create.context';
import { getAllDepartments, createDepartment, deleteDepartment } from '../services/department.api';
import { toast } from 'react-hot-toast';

export const DepartmentProvider = ({ children }) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDepartments = async () => {
        setLoading(true);
        const data = await getAllDepartments();
        if (data?.success) {
            setDepartments(data.departments);
        }
        setLoading(false);
    };

    const handleCreateDepartment = async (name) => {
        setLoading(true);
        try {
            const data = await createDepartment(name);
            if (data?.success) {
                await fetchDepartments();
                toast.success(data.message || "Department created successfully");
                return { success: true };
            }
            toast.error(data?.message || "Failed to create department");
            return { success: false, message: data?.message };
        } catch (error) {
            toast.error("An error occurred during creation");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartment = async (id) => {
        setLoading(true);
        try {
            const data = await deleteDepartment(id);
            if (data?.success) {
                await fetchDepartments();
                toast.success(data.message || "Department deleted successfully");
                return { success: true };
            }
            toast.error(data?.message || "Failed to delete department");
            return { success: false, message: data?.message };
        } catch (error) {
            toast.error("An error occurred during deletion");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <DepartmentContext.Provider value={{ 
            departments, 
            setDepartments, 
            loading, 
            setLoading, 
            handleCreateDepartment,
            handleDeleteDepartment,
            fetchDepartments 
        }}>
            {children}
        </DepartmentContext.Provider>
    );
};