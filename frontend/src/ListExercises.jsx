import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListExercises = () => {
    const [ejercicios, setEjercicios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/ejercicios/');
                setEjercicios(response.data);
            } catch (error) {
                console.error('Error al obtener los ejercicios:', error);
            }
        };
        fetchData();
    }, []);

    const deleteExercise = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/ejercicios/eliminar/${id}/`);
            setEjercicios(ejercicios.filter((ejercicio) => ejercicio.id !== id));
        } catch (error) {
            console.error('Error al eliminar el ejercicio:', error);
        }
    };

    return (
        <div>
            <h2>Lista de Ejercicios</h2>
            <ul>
                {ejercicios.map((ejercicio) => (
                    <li key={ejercicio.id}>
                        {ejercicio.nombre_ejercicio} - {ejercicio.tipo}
                        <Link to={`/edit-exercise/${ejercicio.id}`}>Editar</Link>
                        <button onClick={() => deleteExercise(ejercicio.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListExercises;
