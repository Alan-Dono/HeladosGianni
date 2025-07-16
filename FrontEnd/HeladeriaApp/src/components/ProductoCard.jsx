import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, LinearProgress } from '@mui/material';
import { useTheme } from '@emotion/react';

const ProductoCard = ({ producto, agregar, toggleFavorito }) => {
    const theme = useTheme();
    const [temporizador, setTemporizador] = useState(null);
    const [tiempoPresionado, setTiempoPresionado] = useState(0);
    const [mostrarProgreso, setMostrarProgreso] = useState(false);
    const [clickInicial, setClickInicial] = useState(null);
    const [estaActivo, setEstaActivo] = useState(false);
    const [superoUmbral, setSuperoUmbral] = useState(false); // Nuevo estado

    useEffect(() => {
        return () => {
            if (temporizador) clearTimeout(temporizador);
        };
    }, [temporizador]);

    const handleMouseDown = () => {
        setClickInicial(Date.now());
        setEstaActivo(true);
        setSuperoUmbral(false); // Resetear al iniciar

        const delayId = setTimeout(() => {
            setMostrarProgreso(true);
            setSuperoUmbral(true); // Marcar que superó el umbral
            const startTime = Date.now();

            const actualizarProgreso = () => {
                const elapsed = Date.now() - startTime;
                setTiempoPresionado((elapsed / 3000) * 100);

                if (elapsed < 3000) {
                    requestAnimationFrame(actualizarProgreso);
                }
            };

            actualizarProgreso();

            setTemporizador(
                setTimeout(async () => {
                    await toggleFavorito(producto);
                    resetearEstado();
                }, 3000)
            );
        }, 2000);

        setTemporizador(delayId);
    };

    const handleMouseUp = () => {
        const tiempoTranscurrido = clickInicial ? Date.now() - clickInicial : 0;

        // Solo agregar al carrito si NO superó el umbral de 2 segundos
        if (tiempoTranscurrido < 2000 && !superoUmbral) {
            agregar(producto);
        }

        resetearEstado();
        setEstaActivo(false);
    };

    const resetearEstado = () => {
        clearTimeout(temporizador);
        setMostrarProgreso(false);
        setTiempoPresionado(0);
        setClickInicial(null);
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
                transition: 'all 0.2s ease',
                transform: estaActivo ? 'scale(0.95)' : 'scale(1)',
                boxShadow: estaActivo ? `0 0 15px ${theme.palette.secondary.light}` : 'none',
                '&:hover': {
                    transform: 'scale(1.1)',
                    zIndex: 10,
                },
                '&:active': {
                    transform: 'scale(0.90)',
                }
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {/* Barra de progreso */}
            {mostrarProgreso && (
                <LinearProgress
                    variant="determinate"
                    value={tiempoPresionado}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        backgroundColor: 'transparent',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: theme.palette.secondary.light,
                            boxShadow: `0 0 10px ${theme.palette.secondary.light}`,
                        }
                    }}
                />
            )}

            <Box sx={{
                textAlign: 'center',
                overflow: 'hidden',
                width: '100%',
                px: 0.5,
                opacity: mostrarProgreso ? 0.8 : 1,
                transition: 'opacity 0.3s ease'
            }}>
                <Typography
                    sx={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                    }}
                    noWrap
                >
                    {producto.nombreProducto}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                    }}
                >
                    ${producto.precio.toFixed(2)}
                </Typography>
            </Box>
        </Card>
    );
};

export default ProductoCard;