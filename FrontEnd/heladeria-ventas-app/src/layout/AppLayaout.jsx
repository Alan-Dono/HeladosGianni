import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Menu'; // Asegúrate de que la ruta sea correcta
import { Outlet } from 'react-router-dom';

export const AppLayaout = () => {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box
                sx={{
                    flex: 1,
                    marginLeft: '60px', // Ajusta según el ancho del sidebar
                    padding: '20px',
                    backgroundColor: '#f5f5f5', // Color de fondo claro para el contenido
                    overflowY: 'auto' // Permite el desplazamiento si el contenido es largo
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};
