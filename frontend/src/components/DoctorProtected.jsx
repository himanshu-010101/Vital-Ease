import React from 'react'
import { useDoctorAuth } from '../hooks/useDoctorAuth'
import { Navigate } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'

const DoctorProtected = ({ children }) => {
    const { loading, doctor } = useDoctorAuth()
    
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <ThreeDots
                    height="50"
                    width="50"
                    radius="9"
                    color="#10b981"
                    ariaLabel="three-dots-loading"
                    visible={true}
                />
            </div>
        )
    }
    
    if (!doctor || doctor.role !== 'doctor') {
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default DoctorProtected
