import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Configuración de encabezados para solicitudes autenticadas
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Listar usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/usuarios/', { headers });
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        fetchUsers();
    }, []);

    // Crear usuario
    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No se encontró el token de autenticación. Inicia sesión primero.');
                return;
            }
    
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
    
            console.log("Enviando solicitud con encabezados:", headers);
    
            const response = await axios.post(
                'http://127.0.0.1:8000/api/usuarios/crear/',
                {
                    username,
                    email,
                    password,
                },
                { headers }
            );
    
            setMessage(response.data.message);
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.error);
                console.error("Error al crear usuario:", error.response.data.error);
            } else {
                setMessage('Error al crear el usuario');
                console.error('Error:', error);
            }
        }
    };
    
    
    

    // Editar usuario
    const handleEditUser = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/usuarios/editar/${userId}/`, {
                username,
                email,
                password,
            }, { headers });
            setMessage('Usuario actualizado exitosamente');
            setUserId(null);
            setUsername('');
            setEmail('');
            setPassword('');
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
                    <button onClick={handleEditUser}>Actualizar Usuario</button>
                </div>
            )}

            <h3>Crear Usuario</h3>
            <input placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleCreateUser}>Crear Usuario</button>

            <p>{message}</p>
        </div>
    );
};

export default UserManagement;
