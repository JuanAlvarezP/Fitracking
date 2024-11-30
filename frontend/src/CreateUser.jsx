import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (!validateEmail(email)) {
            setMessage('Por favor, ingresa un correo electrónico válido.');
            return;
        }
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                password,
                email,
            });
            setMessage(response.data.message);
            navigate('/users');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error al registrar usuario');
        }
    };
    

    

    return (
        <div>
            <h2>Crear Usuario</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Registrar</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default CreateUser;
