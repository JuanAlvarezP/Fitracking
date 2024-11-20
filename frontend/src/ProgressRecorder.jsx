import React, { useState } from 'react';
import axios from 'axios';

const RegistrarProgreso = () => {
    const [rutinaId, setRutinaId] = useState('');
    const [ejercicioId, setEjercicioId] = useState('');
    const [repeticiones, setRepeticiones] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [pesoUsado, setPesoUsado] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://127.0.0.1:8000/api/progreso/registrar/', {
                rutina_id: rutinaId,
                ejercicio_id: ejercicioId,
                repeticiones,
                tiempo,
                peso_usado: pesoUsado,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage('Progreso registrado exitosamente');
            setRutinaId('');
            setEjercicioId('');
            setRepeticiones('');
            setTiempo('');
            setPesoUsado('');
        } catch (error) {
            console.error(error);
            setMessage('Error al registrar progreso');
        }
    };

    return (
        <div>
            <h2>Registrar Progreso</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="ID Rutina" value={rutinaId} onChange={(e) => setRutinaId(e.target.value)} />
                <input placeholder="ID Ejercicio" value={ejercicioId} onChange={(e) => setEjercicioId(e.target.value)} />
                <input placeholder="Repeticiones" value={repeticiones} onChange={(e) => setRepeticiones(e.target.value)} />
                <input placeholder="Tiempo (segundos)" value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
                <input placeholder="Peso usado (kg)" value={pesoUsado} onChange={(e) => setPesoUsado(e.target.value)} />
                <button type="submit">Registrar</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default RegistrarProgreso;
