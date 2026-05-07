import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const BrandedLoader = ({ fullScreen = false, size = "md", text = "Loading...", duration = 800, onFinished }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (fullScreen && onFinished) {
            const timer = setTimeout(() => {
                setIsExiting(true);
                // Wait for the exit animation to finish (matching the 700ms in CSS)
                const exitTimer = setTimeout(() => {
                    onFinished();
                }, 700);
                return () => clearTimeout(exitTimer);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [fullScreen, duration, onFinished]);

    const sizeClasses = {
        sm: "h-12",
        md: "h-24",
        lg: "h-32"
    };

    const containerClasses = fullScreen
        ? `fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isExiting ? "opacity-0 -translate-x-full" : "opacity-100 translate-x-0"}`
        : "flex flex-col items-center justify-center p-8 w-full h-full";

    return (
        <div className={containerClasses} id={fullScreen ? "branded-preloader" : undefined}>
            <div className={`relative group transition-transform duration-700 ${isExiting ? "-translate-x-20" : "translate-x-0"}`}>
                <img
                    src={logo}
                    alt="Vital Ease Logo"
                    className={`${sizeClasses[size]} w-auto object-contain animate-logo-pulse`}
                />
            </div>
        </div>
    );
};

export default BrandedLoader;

