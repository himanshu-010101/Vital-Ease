import { useState, useEffect } from 'react';
import { UserAuthContext } from './create.context';
import { getUser as fetchUserApi } from '../services/userAuth.api';

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [detailedUser, setDetailedUser] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                const data = await fetchUserApi();
                if (data?.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Session check failed:", error);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    return (
        <UserAuthContext.Provider value={{ 
            user, setUser, 
            loading, setLoading, 
            detailedUser, setDetailedUser, 
            isDataLoading, setIsDataLoading,
            allUsers, setAllUsers 
        }}>
            {children}
        </UserAuthContext.Provider>
    );
};