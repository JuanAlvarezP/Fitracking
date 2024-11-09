import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const registerUser = async (username, password, email) => {
    const response = await axios.post(`${API_URL}/register/`, {
        username,
        password,
        email,
    });
    return response.data;
};

export const getUsers = async (token) => {
    const response = await axios.get(`${API_URL}/users/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
