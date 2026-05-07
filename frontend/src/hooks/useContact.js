import { useContext } from 'react';
import { ContactContext } from '../context/create.context';
import { toast } from 'react-hot-toast';
import { createContact, getContacts, deleteContact, updateContact } from '../services/contact.api';

export const useContact = () => {
    const context = useContext(ContactContext);
    const { contacts, setContacts, loading, setLoading } = context;

    const handleCreateContact = async ({ fname, lname, phone, email, message }) => {
        setLoading(true);
        try {
            const data = await createContact({ fname, lname, phone, email, message });
            if (data?.contact) {
                setContacts([...contacts, data.contact]);
                toast.success("We will contact you soon");
                return data.contact;
            }
            toast.error("Failed to create contact");
            return null;
        } catch (error) {
            toast.error("Failed to create contact");
            console.error('Create contact error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleGetContacts = async () => {
        setLoading(true);
        try {
            const data = await getContacts();
            if (data?.contacts) {
                setContacts(data.contacts);
                return data.contacts;
            }
            toast.error("Failed to fetch contacts");
            return null;
        } catch (error) {
            toast.error("Failed to fetch contacts");
            console.error('Get contacts error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = async (id) => {
        setLoading(true);
        try {
            const data = await deleteContact(id);
            if (data?.contact) {
                setContacts(contacts.filter(contact => contact._id !== id));
                toast.success("Contact deleted successfully");
                return data.contact;
            }
            toast.error("Failed to delete contact");
            return null;
        } catch (error) {
            toast.error("Failed to delete contact");
            console.error('Delete contact error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateContact = async (id, contactData) => {
        setLoading(true);
        try {
            const data = await updateContact(id, contactData);
            if (data?.contact) {
                setContacts(contacts.map(contact => contact._id === id ? data.contact : contact));
                toast.success("Contact updated successfully");
                return data.contact;
            }
            toast.error("Failed to update contact");
            return null;
        } catch (error) {
            toast.error("Failed to update contact");
            console.error('Update contact error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        contacts,
        loading,
        handleCreateContact,
        handleGetContacts,
        handleDeleteContact,
        handleUpdateContact
    };
};