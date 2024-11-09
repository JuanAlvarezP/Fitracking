import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListRoutines = () => {
    const [rutinas, setRutinas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/rutinas/');
            setRutinas(response.data);
        };
        fetchData();
    }, []);

    const deleteRoutine = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/rutinas/eliminar/${id}/`);
        setRutinas(rutinas.filter((rutina) => rutina.id !== id));
    };

    return (
        <div>
            <h2>Lista de Rutinas</h2>
            <ul>
                {rutinas.map((rutina) => (
                    <li key={rutina.id}>
                        {rutina.nombre_rutina} - {rutina.objetivo}
                        <Link to={`/edit-routine/${rutina.id}`}>Editar</Link>
                        <button onClick={() => deleteRoutine(rutina.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListRoutines;
