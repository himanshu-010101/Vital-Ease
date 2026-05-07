import React from 'react'
import { useUserAuth } from '../hooks/useUserAuth'
import { Navigate } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'

const Protected = ({ children }) => {
    const { loading, user } = useUserAuth()
    
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <ThreeDots
                    height="50"
                    width="50"
                    radius="9"
                    color="#ff2f00"
                    ariaLabel="three-dots-loading"
                    visible={true}
                />
            </div>
        )
    }
    
    if (!user) {
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected