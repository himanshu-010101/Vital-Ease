import { useContext } from 'react';
import { ServProgContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { createServProg, getAllServProg, deleteServProg } from '../services/servProg.api';

export const useServProg = () => {
    const context = useContext(ServProgContext);
    const { servProg, setServProg, loading, setLoading } = context;

    const handleCreateServProg = async ({ file, title, desc, type }) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("desc", desc);
            formData.append("type", type);

            const data = await createServProg(formData);
            if (data?.service) {
                setServProg([...servProg, data.service]);
                toast.success("Service or programme created successfully");
                return data.service;
            }
            toast.error("Failed to create service or programme");
            return null;
        } catch (error) {
            toast.error("Failed to create service or programme");
            console.error('Create service or programme error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllServProg = async () => {
        setLoading(true);
        try {
            const data = await getAllServProg();
            if (data?.data) {
                setServProg(data.data);
                return data.data;
            }
            toast.error("Failed to fetch services or programmes");
            return null;
        } catch (error) {
            toast.error("Failed to fetch services or programmes");
            console.error('Get services or programmes error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteServProg = async (id) => {
        setLoading(true);
        try {
            const data = await deleteServProg(id);
            if (data?.message === "Deleted successfully") {
                setServProg(servProg.filter(item => item._id !== id));
                toast.success("Service or programme deleted successfully");
                return true;
            }
            toast.error("Failed to delete service or programme");
            return null;
        } catch (error) {
            toast.error("Failed to delete service or programme");
            console.error('Delete service or programme error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        servProg,
        loading,
        handleCreateServProg,
        handleGetAllServProg,
        handleDeleteServProg
    };
};