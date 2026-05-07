import { useState } from 'react';
import { ContactContext } from './create.context';

export const ContactProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <ContactContext.Provider value={{ contacts, setContacts, loading, setLoading }}>
            {children}
        </ContactContext.Provider>
    );
};