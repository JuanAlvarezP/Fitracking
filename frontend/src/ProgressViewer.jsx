import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgressViewer = () => {
    const [progress, setProgress] = useState([]);
    const [message, setMessage] = useState('');

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setMessage('No estás autenticado. Por favor, inicia sesión.');
                return;
            }

            const response = await axios.get(
                'http://127.0.0.1:8000/api/progreso/listar/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProgress(response.data);
        } catch (err) {
            console.error('Error fetching progress:', err);
            setMessage('Error al obtener el progreso.');
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    return (
        <div>
            <h2>Progreso</h2>
            {message && <p>{message}</p>}
            {progress.length === 0 ? (
                <p>No hay progreso registrado.</p>
            ) : (
                <ul>
                    {progress.map((item, index) => (
                        <li key={index}>
                            {item.rutina__nombre_rutina} - {item.ejercicio__nombre_ejercicio}: {item.repeticiones} repeticiones, {item.tiempo} minutos, {item.peso_usado} kg
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProgressViewer;
