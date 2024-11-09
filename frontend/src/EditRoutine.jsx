import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRoutine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [tiempoDisponible, setTiempoDisponible] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/rutinas/${id}/`);
                const rutina = response.data;
                setNombre(rutina.nombre_rutina);
                setObjetivo(rutina.objetivo);
                setTiempoDisponible(rutina.tiempo_disponible);
                setUsuarioId(rutina.usuario_id);
            } catch (error) {
                console.error('Error al obtener la rutina:', error);
            }
        };
        fetchRoutine();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/rutinas/editar/${id}/`, {
                nombre_rutina: nombre,
                objetivo,
                tiempo_disponible: tiempoDisponible,
                usuario_id: usuarioId,
            });
            setMessage('Rutina actualizada exitosamente');
            navigate('/rutinas');
        } catch (error) {
            setMessage('Error al actualizar la rutina');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Editar Rutina</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <input placeholder="Objetivo" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
                <input placeholder="Tiempo Disponible" value={tiempoDisponible} onChange={(e) => setTiempoDisponible(e.target.value)} />
                <input placeholder="Usuario ID" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} />
                <button type="submit">Actualizar</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default EditRoutine;
