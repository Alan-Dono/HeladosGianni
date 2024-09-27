// src/components/ProductoCard.js
import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { useTheme } from '@emotion/react';

const ProductoCard = ({ producto, agregar }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: '80px', // Altura ajustada
                width: '70px', // Ancho ajustado
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centrar contenido verticalmente
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
                mr: 0.5,
                mb: 0.5,
                backgroundColor: theme.palette.background.componentes, // Color de fondo para la tarjeta
                color: theme.palette.text.secondary, // Color del texto
                overflow: 'visible', // Permitir que el contenido desbordado sea visible
                transition: 'transform 0.2s ease, z-index 0.2s ease', // Transición suave para el hover
                '&:hover': {
                    color: 'black',
                    backgroundColor: theme.palette.primary.main, // Cambio de fondo al pasar el mouse
                    transform: 'scale(1.2)', // Agrandar la tarjeta al hacer hover
                    zIndex: 10, // Asegurarte de que esté por encima de otros componentes
                }
            }}
            onClick={() => agregar(producto)} // Función para agregar el producto al hacer clic
        >
            <Box
                sx={{
                    textAlign: 'center', // Centrar texto
                    overflow: 'hidden', // Mantener el desbordamiento oculto en estado normal
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        wordBreak: 'break-word', // Permitir que las palabras se rompan
                    }}
                    noWrap={false} // Permitir el ajuste de línea
                >
                    {producto.nombre}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        wordBreak: 'break-word', // Permitir que las palabras se rompan
                    }}
                >
                    ${producto.precio.toFixed(2)} {/* Formato de precio */}
                </Typography>
            </Box>
        </Card>
    );
};

export default ProductoCard;
