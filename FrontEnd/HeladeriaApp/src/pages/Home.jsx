import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion'; // Importamos framer-motion
import { GitHub, LinkedIn } from '@mui/icons-material'; // Iconos de redes sociales

// Imagen de Gianni Helados
const gelatoImage = 'https://assets.elgourmet.com/wp-content/uploads/2023/09/shutterstock_2298618195-1024x574.jpg.webp';

const Home = () => {
    const theme = useTheme();
    const backgroundColor = theme.palette.background.default;
    const isDarkMode = theme.palette.mode === 'dark';  // Verificamos si es modo oscuro

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0,
                backgroundColor: backgroundColor,
                position: 'relative',
                overflow: 'hidden', // Para asegurarnos de que la imagen no se desborde
            }}
        >
            {/* Imagen de gelato */}
            <motion.img
                src={gelatoImage}
                alt="Helado Gianni"
                initial={{ scale: 0 }} // Comienza desde un tamaño de 0
                animate={{ scale: 1 }} // Escala a su tamaño original
                transition={{ duration: 1.5, type: 'spring', stiffness: 100 }} // Animación suave
                style={{
                    position: 'absolute',
                    zIndex: 0, // Para que quede detrás del contenido
                    maxWidth: '50%', // Limitar el tamaño de la imagen
                    filter: isDarkMode ? 'brightness(0.6)' : 'none', // Ajusta el brillo según el modo
                }}
            />

            {/* Animación de texto */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}  // Animación suave desde abajo
                animate={{ opacity: 1, y: 0 }}    // El estado final al que queremos llegar
                transition={{ duration: 1.5, ease: 'easeOut' }} // Animación suave y más larga
            >
                <Typography
                    variant="h2"
                    component="h2"
                    align="center"
                    sx={{
                        color: theme.palette.text.primary,
                        zIndex: 1, // Aseguramos que el texto esté encima de la imagen
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Sombra para destacar en cualquier fondo
                    }}
                >
                    ¡Bienvenido a Gianni Helados!
                </Typography>
            </motion.div>

            {/* Redes sociales */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '20px',  // Posicionamos abajo
                    left: '50%',
                    transform: 'translateX(-50%)',  // Centramos
                    display: 'flex',
                    gap: '10px',
                    zIndex: 1, // Aseguramos que los iconos estén sobre la imagen
                }}
            >
                <Link href="https://github.com/Alan-Dono" target="_blank" rel="noopener noreferrer">
                    <IconButton sx={{ color: 'white', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                        <GitHub />
                    </IconButton>
                </Link>
                <Link href="https://www.linkedin.com/in/alan-nicolas-dono/" target="_blank" rel="noopener noreferrer">
                    <IconButton sx={{ color: 'white', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                        <LinkedIn />
                    </IconButton>
                </Link>
            </Box>
        </Box>
    );
};

export default Home;
