import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Register from './Register';
import Login from './Login';
import UserManagement from './UserManagement';
import ListExercises from './ListExercises';
import CreateExercise from './CreateExercise';
import EditExercise from './EditExercise';
import ListRoutines from './ListRoutines';
import CreateRoutine from './CreateRoutine';
import EditRoutine from './EditRoutine';
import ProtectedLayout from './ProtectedLayout';
import ProgressRecorder from './ProgressRecorder';
import ProgressViewer from './ProgressViewer';
import Recomendaciones from './Recomendaciones';
import ReportDashboard from './ReportDashboard'; // Importar el nuevo componente

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                {/* Rutas protegidas */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/ejercicios" element={<ListExercises />} />
                    <Route path="/create-exercise" element={<CreateExercise />} />
                    <Route path="/edit-exercise/:id" element={<EditExercise />} />
                    <Route path="/rutinas" element={<ListRoutines />} />
                    <Route path="/create-routine" element={<CreateRoutine />} />
                    <Route path="/edit-routine/:id" element={<EditRoutine />} />
                    <Route path="/record-progress" element={<ProgressRecorder />} />
                    <Route path="/view-progress" element={<ProgressViewer />} />
                    <Route path="/recomendaciones" element={<Recomendaciones />} />
                    <Route path="/reporte" element={<ReportDashboard />} /> {/* Nueva ruta */}
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>
);
