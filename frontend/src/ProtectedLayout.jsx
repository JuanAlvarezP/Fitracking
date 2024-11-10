import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedLayout = () => {
    const token = localStorage.getItem('accessToken');

    // Verificar si el usuario está autenticado
    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default ProtectedLayout;
