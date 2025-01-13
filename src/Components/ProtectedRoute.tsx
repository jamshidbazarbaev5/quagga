import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div>Loading...</div>; // Or your loading component
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};