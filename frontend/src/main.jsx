import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Register from './Register';
import UserManagement from './UserManagement';
import CreateUser from './CreateUser';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<Register />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/create-user" element={<CreateUser />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
