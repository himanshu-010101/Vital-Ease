import React from 'react'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { Navigate } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'

const AdminProtected = ({ children }) => {
    const { loading, admin } = useAdminAuth()
    
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <ThreeDots
                    height="50"
                    width="50"
                    radius="9"
                    color="#00a6ff"
                    ariaLabel="three-dots-loading"
                    visible={true}
                />
            </div>
        )
    }
    
    if (!admin || admin.role !== 'admin') {
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default AdminProtected
