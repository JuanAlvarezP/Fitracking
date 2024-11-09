import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            navigate('/');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    const handleCreateUser = () => {
        navigate('/create-user');
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Gestión de Usuarios</h2>
            <button onClick={handleLogout}>Cerrar Sesión</button>
            <button onClick={handleCreateUser}>Crear Usuario</button>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
