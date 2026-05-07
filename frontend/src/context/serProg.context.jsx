import { useState } from 'react';
import { ServProgContext } from './create.context';

export const ServProgProvider = ({ children }) => {
    const [servProg, setServProg] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <ServProgContext.Provider value={{ servProg, setServProg, loading, setLoading }}>
            {children}
        </ServProgContext.Provider>
    );
};