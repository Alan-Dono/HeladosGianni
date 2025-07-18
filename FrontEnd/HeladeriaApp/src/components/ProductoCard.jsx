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
    const [superoUmbral, setSuperoUmbral] = useState(false);

    useEffect(() => {
        return () => {
            if (temporizador) clearTimeout(temporizador);
        };
    }, [temporizador]);

    const handleMouseDown = () => {
        setClickInicial(Date.now());
        setEstaActivo(true);
        setSuperoUmbral(false);

        const delayId = setTimeout(() => {
            setMostrarProgreso(true);
            setSuperoUmbral(true);
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

    // Elegimos el color para el glow
    const glowColor =
        theme.palette.custom?.glow ||
        theme.palette.secondary?.light ||
        theme.palette.secondary?.main;

    return (
        <Card
            sx={{
                height: '80px',
                width: '80px',
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
                boxShadow: estaActivo
                    ? `0 0 30px 10px ${glowColor}`
                    : 'none',
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
                            backgroundColor: glowColor,
                            boxShadow: `0 0 12px 4px ${glowColor}`,
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
                        fontSize: '0.90rem',
                        fontWeight: 'bold',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textAlign: 'center',
                    }}
                    >
                    {producto.nombreProducto}
                    </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    }}
                >
                    ${producto.precio.toLocaleString('es-AR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                        })
                        }
                </Typography>
            </Box>
        </Card>
    );
};

export default ProductoCard;
