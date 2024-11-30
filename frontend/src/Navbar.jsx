import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ handleLogout }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token); // Verificar si está autenticado

        if (token) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/user-info/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setIsAdmin(response.data.is_staff); // Verifica si el usuario es admin
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            };

            fetchUserInfo();
        }
    }, []);

    if (!isAuthenticated) return null; // No mostrar la navbar si no está autenticado

    return (
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '15px' }}>
                <li><Link to="/">Inicio</Link></li>
                {isAdmin && <li><Link to="/users">Gestión de Usuarios</Link></li>}
                <li><Link to="/ejercicios">Lista de Ejercicios</Link></li>
                {isAdmin && <li><Link to="/create-exercise">Crear Ejercicio</Link></li>}
                <li><Link to="/rutinas">Lista de Rutinas</Link></li>
                {isAdmin && <li><Link to="/create-routine">Crear Rutina</Link></li>}
                <li><Link to="/record-progress">Registrar Progreso</Link></li>
                <li><Link to="/view-progress">Ver Progreso</Link></li>
                <li><Link to="/recomendaciones">Recomendaciones</Link></li>
                <li><Link to="/reporte">Reporte de Progreso</Link></li> {/* Nuevo enlace */}

                <li>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
