import React, { useState } from 'react';
import axios from 'axios';

const CreateRoutine = () => {
    const [nombre, setNombre] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [tiempoDisponible, setTiempoDisponible] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/rutinas/crear/', {
                nombre_rutina: nombre,
                objetivo,
                tiempo_disponible: tiempoDisponible,
                usuario_id: usuarioId,
            });
            setMessage('Rutina creada exitosamente');
            setNombre('');
            setObjetivo('');
            setTiempoDisponible('');
            setUsuarioId('');
        } catch (error) {
            setMessage('Error al crear la rutina');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Crear Rutina</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <input placeholder="Objetivo" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
                <input placeholder="Tiempo Disponible" value={tiempoDisponible} onChange={(e) => setTiempoDisponible(e.target.value)} />
                <input placeholder="Usuario ID" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} />
                <button type="submit">Crear</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default CreateRoutine;
