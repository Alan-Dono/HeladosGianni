import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';
import { useTheme } from '@mui/material/styles';

const Layout = ({ isDarkMode, toggleTheme }) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.background.default;

    return (
        <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
            {/* Contenedor del menú */}
            <Box
                sx={{
                    zIndex: 1,
                    position: 'absolute',
                    height: '100%',
                    transition: 'width 0.3s',
                    left: 0,
                    width: '80px', // Ancho del menú cerrado
                    bgcolor: theme.palette.background.paper,
                    overflow: 'hidden',
                }}
            >
                <Nav isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </Box>
            {/* Contenido principal, que ocupa el espacio restante */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    m: 0,
                    height: '100%',
                    bgcolor: backgroundColor,
                    overflow: 'hidden', // Cambia a 'hidden' para evitar el scroll
                    marginLeft: '80px', // Este margen iguala el ancho del menú
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
