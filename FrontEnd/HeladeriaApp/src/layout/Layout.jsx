import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';
import { useTheme } from '@mui/material/styles'; // Importar useTheme

const Layout = ({ isDarkMode, toggleTheme }) => {
    const theme = useTheme(); // Obtener el tema actual
    const backgroundColor = isDarkMode ? theme.palette.background.default : theme.palette.background.default; // Color de fondo general

    return (
        <Box sx={{ display: 'flex', backgroundColor: backgroundColor, height: '100vh' }}>
            <Nav isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: isDarkMode ? theme.palette.background.default : theme.palette.background.default }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
