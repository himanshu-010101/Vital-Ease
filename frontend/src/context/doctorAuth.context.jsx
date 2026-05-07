import { useState, useEffect } from 'react';
import { DoctorAuthContext } from './create.context';
import { getDoctor as fetchDoctorApi } from '../services/doctorAuth.api';

export const DoctorAuthProvider = ({ children }) => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailedDoctor, setDetailedDoctor] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                const data = await fetchDoctorApi();
                if (data?.doctor) {
                    setDoctor(data.doctor);
                }
            } catch (error) {
                console.error("Doctor session check failed:", error);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    return (
        <DoctorAuthContext.Provider value={{
            doctor, setDoctor,
            loading, setLoading,
            detailedDoctor, setDetailedDoctor,
            isDataLoading, setIsDataLoading
        }}>
            {children}
        </DoctorAuthContext.Provider>
    );
};