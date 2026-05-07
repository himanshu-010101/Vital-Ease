import { useState } from 'react';
import { AppointmentContext } from './create.context';

export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <AppointmentContext.Provider value={{ appointments, setAppointments, loading, setLoading }}>
            {children}
        </AppointmentContext.Provider>
    );
};