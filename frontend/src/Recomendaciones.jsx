import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [message, setMessage] = useState('');

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Obtén el token desde localStorage
            if (!token) {
                setMessage('No estás autenticado. Por favor, inicia sesión.');
                return;
            }

            const response = await axios.post(
                'http://127.0.0.1:8000/api/recomendaciones/generar/',
                {}, // Sin datos en el cuerpo de la solicitud
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                    },
                }
            );

            console.log('Recomendaciones recibidas:', response.data);
            if (response.data.recomendaciones.length === 0) {
                setMessage('No hay recomendaciones disponibles.');
            } else {
                setRecommendations(response.data.recomendaciones);
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setMessage('Error al generar recomendaciones.');
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div>
            <h2>Recomendaciones</h2>
            {message && <p>{message}</p>}
            {recommendations.length > 0 && (
                <ul>
                    {recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Recommendations;
