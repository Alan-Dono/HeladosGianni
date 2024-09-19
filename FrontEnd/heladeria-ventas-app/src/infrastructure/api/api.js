import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7266/api', // Coloca aquí la URL de tu backend
    headers: {
    'Content-Type': 'application/json',
    },
});

export default api;
