import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Rutinas = () => {
    const [rutinas, setRutinas] = useState([]);

    const fetchRutinas = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/rutinas/');
        setRutinas(response.data);
    };

    useEffect(() => {
        fetchRutinas();
    }, []);

    return (
        <div>
            <h2>Lista de Rutinas</h2>
            <ul>
                {rutinas.map((rutina) => (
                    <li key={rutina.id}>{rutina.nombre} - {rutina.objetivo}</li>
                ))}
            </ul>
        </div>
    );
};

export default Rutinas;
