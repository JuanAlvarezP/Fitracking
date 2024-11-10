import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { refreshAccessToken } from './api';



const UserManagement = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');
    const [isStaff, setIsStaff] = useState(false);
    const [loading, setLoading] = useState(false);



    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Configuración de encabezados para solicitudes autenticadas
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Listar usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('accessToken');
            const isAdmin = localStorage.getItem('is_staff') === 'true';
    
            if (!token || !isAdmin) {
                setMessage('No tienes permiso para ver esta página.');
                return;
            }
    
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/usuarios/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        fetchUsers();
    }, []);
    
    
    // Crear usuario
    const handleCreateUser = async () => {
        setLoading(true);
        try {
            let token = localStorage.getItem('accessToken');
            if (!token) {
                setMessage('No se encontró el token de autenticación. Inicia sesión primero.');
                setLoading(false);
                return;
            }
    
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };
    
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/usuarios/crear/',
                    {
                        username,
                        email,
                        password,
                        is_staff: isStaff,
                    },
                    { headers }
                );
                setMessage(response.data.message);
            } catch (error) {
                // Si obtenemos un error 401, intentamos refrescar el token
                if (error.response?.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        localStorage.setItem('accessToken', newToken);
                        headers.Authorization = `Bearer ${newToken}`;
                        const retryResponse = await axios.post(
                            'http://127.0.0.1:8000/api/usuarios/crear/',
                            {
                                username,
                                email,
                                password,
                                is_staff: isStaff,
                            },
                            { headers }
                        );
                        setMessage(retryResponse.data.message);
                    } else {
                        setMessage('No se pudo actualizar el token. Inicia sesión nuevamente.');
                    }
                } else {
                    setMessage(error.response?.data?.error || 'Error al crear el usuario');
                }
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
            setMessage('Error de red o del servidor');
        } finally {
            setLoading(false);
        }
    };
    
    
    


    // Editar usuario
    const handleEditUser = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/usuarios/editar/${userId}/`, {
                username,
                email,
                password,
                is_staff: isStaff,
            }, { headers });
            setMessage('Usuario actualizado exitosamente');
            setUserId(null);
            setUsername('');
            setEmail('');
            setPassword('');
            setIsStaff(false);
        } catch (error) {
            setMessage('Error al actualizar el usuario');
            console.error(error);
        }
    };
    

    // Eliminar usuario
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/usuarios/eliminar/${id}/`, { headers });
            setUsuarios(usuarios.filter((user) => user.id !== id));
            setMessage('Usuario eliminado exitosamente');
        } catch (error) {
            setMessage('Error al eliminar el usuario');
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('is_staff');
        window.location.href = '/login'; // Redireccionar a la página de login
    };
    
    

    return (
        <div>
            <h2>Gestión de Usuarios</h2>
            <ul>
                {usuarios.map((user) => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                        <button onClick={() => setUserId(user.id)}>Editar</button>
                        <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>

            {userId && (
                <div>
                    <h3>Editar Usuario</h3>
                    <input placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label>
                        <input
                            type="checkbox"
                            checked={isStaff}
                            onChange={(e) => setIsStaff(e.target.checked)}
                        /> Es Administrador
                    </label>
                    <button onClick={handleEditUser}>Actualizar Usuario</button>
                </div>
            )}

            <h3>Crear Usuario</h3>
            <input placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>
                <input
                    type="checkbox"
                    checked={isStaff}
                    onChange={(e) => setIsStaff(e.target.checked)}
                /> Es Administrador
            </label>
            {loading ? <p>Creando usuario...</p> : <button onClick={handleCreateUser}>Crear Usuario</button>}


            <p>{message}</p>
        </div>
    );
};

export default UserManagement;
