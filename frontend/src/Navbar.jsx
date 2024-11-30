import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
    return (
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '15px' }}>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/users">Gestión de Usuarios</Link></li>
                <li><Link to="/ejercicios">Lista de Ejercicios</Link></li>
                <li><Link to="/create-exercise">Crear Ejercicio</Link></li>
                <li><Link to="/rutinas">Lista de Rutinas</Link></li>
                <li><Link to="/create-routine">Crear Rutina</Link></li>
                <li><Link to="/record-progress">Registrar Progreso</Link></li>
                <li><Link to="/view-progress">Ver Progreso</Link></li>
                <li><Link to="/recomendaciones">Recomendaciones</Link></li>


                <li>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
