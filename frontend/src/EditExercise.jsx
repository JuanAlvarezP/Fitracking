import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditExercise = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [message, setMessage] = useState('');

    // Cargar los datos del ejercicio al montar el componente
    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/ejercicios/${id}/`);
                const ejercicio = response.data;
                setNombre(ejercicio.nombre_ejercicio);
                setTipo(ejercicio.tipo);
                setDificultad(ejercicio.dificultad);
                setDescripcion(ejercicio.descripcion);
            } catch (error) {
                console.error('Error al obtener el ejercicio:', error);
            }
        };
        fetchExercise();
    }, [id]);

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/ejercicios/editar/${id}/`, {
                nombre_ejercicio: nombre,
                tipo,
                dificultad,
                descripcion,
            });
            setMessage('Ejercicio actualizado exitosamente');
            navigate('/ejercicios');
        } catch (error) {
            setMessage('Error al actualizar el ejercicio');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Editar Ejercicio</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Dificultad"
                    value={dificultad}
                    onChange={(e) => setDificultad(e.target.value)}
                />
                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                <button type="submit">Actualizar</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default EditExercise;
