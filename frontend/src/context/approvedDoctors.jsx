import { useState } from 'react';
import { ApprovedDoctorsContext } from './create.context';

export const ApprovedDoctorsProvider = ({ children }) => {
    const [approvedDoctors, setApprovedDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <ApprovedDoctorsContext.Provider value={{ approvedDoctors, setApprovedDoctors, loading, setLoading }}>
            {children}
        </ApprovedDoctorsContext.Provider>
    );
};