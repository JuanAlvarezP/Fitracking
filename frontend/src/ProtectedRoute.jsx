import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('accessToken');
    const isAdmin = localStorage.getItem('is_staff') === 'true';

    // Verificar si el usuario está autenticado
    if (!token) {
        alert("No has iniciado sesión. Redireccionando a la página de inicio de sesión.");
        return <Navigate to="/login" />;
    }

    // Verificar si la ruta es solo para administradores
    if (adminOnly && !isAdmin) {
        alert("Acceso denegado. Solo los administradores pueden acceder a esta página.");
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
