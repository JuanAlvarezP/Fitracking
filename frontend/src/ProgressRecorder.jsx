import React, { useState } from 'react';
import axios from 'axios';

const ProgressRecorder = () => {
    const [rutina_id, setRutinaId] = useState('');
    const [ejercicio_id, setEjercicioId] = useState('');
    const [repeticiones, setRepeticiones] = useState('');
    const [tiempoEnMinutos, setTiempoEnMinutos] = useState('');
    const [peso_usado, setPesoUsado] = useState('');
    const [fecha, setFecha] = useState(''); // Nuevo campo de fecha
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setMessage('No estás autenticado. Por favor, inicia sesión.');
            return;
        }

        const data = {
            rutina_id,
            ejercicio_id,
            repeticiones,
            tiempo: tiempoEnMinutos,
            peso_usado,
            fecha: fecha || undefined, // Enviar fecha solo si se proporciona
        };

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/progreso/registrar/',
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage('Progreso registrado exitosamente.');
        } catch (error) {
            console.error('Error al registrar el progreso:', error.response?.data || error.message);
            setMessage('Hubo un problema al registrar el progreso.');
        }
    };

    return (
        <div>
            <h2>Registrar Progreso</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Rutina ID:</label>
                    <input
                        type="text"
                        value={rutina_id}
                        onChange={(e) => setRutinaId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Ejercicio ID:</label>
                    <input
                        type="text"
                        value={ejercicio_id}
                        onChange={(e) => setEjercicioId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Repeticiones:</label>
                    <input
                        type="number"
                        value={repeticiones}
                        onChange={(e) => setRepeticiones(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Tiempo (minutos):</label>
                    <input
                        type="number"
                        step="0.01"
                        value={tiempoEnMinutos}
                        onChange={(e) => setTiempoEnMinutos(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Peso Usado (kg):</label>
                    <input
                        type="number"
                        step="0.01"
                        value={peso_usado}
                        onChange={(e) => setPesoUsado(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Fecha (opcional):</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </div>
                <button type="submit">Registrar Progreso</button>
            </form>
        </div>
    );
};

export default ProgressRecorder;
