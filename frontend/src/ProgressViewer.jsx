import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListarProgreso = () => {
    const [progreso, setProgreso] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProgreso = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://127.0.0.1:8000/api/progreso/listar/1/`, { // Cambia el 1 por el ID del usuario actual
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProgreso(response.data);
            } catch (error) {
                console.error(error);
                setMessage('Error al obtener progreso');
            }
        };
        fetchProgreso();
    }, []);

    return (
        <div>
            <h2>Progreso del Usuario</h2>
            {message && <p>{message}</p>}
            <ul>
                {progreso.map((p) => (
                    <li key={p.id}>
                        {p.fecha}: {p.ejercicio__nombre_ejercicio} - {p.repeticiones} reps, {p.tiempo} segundos, {p.peso_usado} kg
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListarProgreso;
