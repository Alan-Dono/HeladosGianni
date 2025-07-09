import React, { useState } from 'react';
import { Card, Typography, Box } from '@mui/material';
import { useTheme } from '@emotion/react';

const ProductoCard = ({ producto, agregar, toggleFavorito }) => {
    const theme = useTheme();
    const [clicProlongado, setClicProlongado] = useState(false);
    const [temporizador, setTemporizador] = useState(null);

    // Maneja el clic prolongado para agregar/eliminar de favoritos (3 segundos)
    const handleMouseDown = () => {
        // Inicia el temporizador para el clic prolongado
        const temporizadorFavorito = setTimeout(async () => {
            await toggleFavorito(producto); // Acción de favorito
            setClicProlongado(true); // Marca que el clic prolongado se activó
        }, 3000);

        setTemporizador(temporizadorFavorito);
    };

    // Maneja el clic simple para agregar al carrito
    const handleClick = () => {
        if (!clicProlongado) {
            agregar(producto); // Solo se agrega al carrito si no fue clic prolongado
        }
        setClicProlongado(false); // Restablece el estado para el próximo clic
    };

    // Cancela el temporizador si el mouse es liberado antes de los 3 segundos
    const handleMouseUp = () => {
        if (!clicProlongado) {
            clearTimeout(temporizador); // Cancela el temporizador si el clic fue rápido
        }
    };

    return (
        <Card
            sx={{
                height: '80px',
                width: '70px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
                mr: 0.5,
                mb: 0.5,
                backgroundColor: producto.favorito ? theme.palette.primary.main : theme.palette.background.componentes,
                color: producto.favorito ? 'black' : theme.palette.text.secondary,
                overflow: 'visible',
                transition: 'transform 0.2s ease, z-index 0.2s ease',
                '&:hover': {
                    color: 'black',
                    backgroundColor: theme.palette.primary.main,
                    transform: 'scale(1.2)',
                    zIndex: 10,
                }
            }}
            onMouseDown={handleMouseDown} // Detecta el inicio de un clic prolongado
            onMouseUp={handleMouseUp} // Detecta cuando se suelta el clic
            onClick={handleClick} // Maneja el clic simple para agregar al carrito
        >
            <Box
                sx={{
                    textAlign: 'center',
                    overflow: 'hidden',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        wordBreak: 'break-word',
                    }}
                    noWrap={false}
                >
                    {producto.nombreProducto}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        wordBreak: 'break-word',
                    }}
                >
                    ${producto.precio.toFixed(2)}
                </Typography>
            </Box>
        </Card>
    );
};

export default ProductoCard;
