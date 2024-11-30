import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressRecorder = () => {
    const [rutinas, setRutinas] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    const [rutina_id, setRutinaId] = useState('');
    const [ejercicio_id, setEjercicioId] = useState('');
    const [repeticiones, setRepeticiones] = useState('');
    const [tiempoEnMinutos, setTiempoEnMinutos] = useState(''); // Tiempo en minutos
    const [peso_usado, setPesoUsado] = useState('');
    const [fecha, setFecha] = useState(''); // Nuevo campo para la fecha
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Obtener la lista de rutinas y ejercicios
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const [rutinasResponse, ejerciciosResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/rutinas/', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://127.0.0.1:8000/api/ejercicios/', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setRutinas(rutinasResponse.data);
                setEjercicios(ejerciciosResponse.data);
            } catch (error) {
                console.error('Error al obtener rutinas o ejercicios:', error);
                setMessage('Error al cargar rutinas y ejercicios.');
            }
        };

        fetchData();
    }, []);

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
            tiempo: tiempoEnMinutos, // Enviar tiempo en minutos
            peso_usado,
            fecha, // Incluir la fecha
        };

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/progreso/registrar/',
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage('Progreso registrado exitosamente.');
        } catch (error) {
            console.error('Error al registrar el progreso:', error);
            setMessage('Hubo un problema al registrar el progreso.');
        }
    };

    return (
        <div>
            <h2>Registrar Progreso</h2>
            {message && <p>{message}</p>}

            <div>
                <h3>Rutinas Disponibles</h3>
                {rutinas.map((rutina) => (
                    <p key={rutina.id}>{`${rutina.id}: ${rutina.nombre_rutina}`}</p>
                ))}

                <h3>Ejercicios Disponibles</h3>
                {ejercicios.map((ejercicio) => (
                    <p key={ejercicio.id}>{`${ejercicio.id}: ${ejercicio.nombre_ejercicio}`}</p>
                ))}
            </div>

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
                    <label>Fecha:</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrar Progreso</button>
            </form>
        </div>
    );
};

export default ProgressRecorder;
