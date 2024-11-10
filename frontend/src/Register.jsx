import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            setMessage('Todos los campos son obligatorios');
            return;
        }
        if (password.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            console.log("Enviando solicitud de registro:", { username, email, password });
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                email,
                password,
            });

            console.log("Respuesta del servidor:", response.data);
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error("Error al registrar usuario:", error.response?.data);
            setMessage(error.response?.data?.error || 'Error al registrar usuario');
        }
    };

    return (
        <div>
            <h2>Registrar Usuario</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Registrar</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Register;
