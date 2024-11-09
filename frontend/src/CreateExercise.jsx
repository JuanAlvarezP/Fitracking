import React, { useState } from 'react';
import axios from 'axios';

const CreateExercise = () => {
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/ejercicios/crear/', {
                nombre_ejercicio: nombre,
                tipo,
                dificultad,
                descripcion,
            });
            setMessage('Ejercicio creado exitosamente');
            setNombre('');
            setTipo('');
            setDificultad('');
            setDescripcion('');
        } catch (error) {
            setMessage('Error al crear el ejercicio');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Crear Ejercicio</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <input placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
                <input placeholder="Dificultad" value={dificultad} onChange={(e) => setDificultad(e.target.value)} />
                <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                <button type="submit">Crear</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default CreateExercise;
