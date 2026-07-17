import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, Typography, Box, LinearProgress } from '@mui/material';
import { useTheme } from '@emotion/react';

const ProductoCard = ({ producto, agregar, toggleFavorito, index, moveProduct }) => {
    const theme = useTheme();
    const [tiempoPresionado, setTiempoPresionado] = useState(0);
    const [mostrarProgreso, setMostrarProgreso] = useState(false);
    const [estaActivo, setEstaActivo] = useState(false);
    const ref = useRef(null);
    const delayRef = useRef(null);
    const favoritoRef = useRef(null);
    const animationFrameRef = useRef(null);
    const clickInicialRef = useRef(null);
    const estaActivoRef = useRef(false);
    const superoUmbralRef = useRef(false);

    const [{ isDragging }, drag] = useDrag({
        type: 'PRODUCTO',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'PRODUCTO',
        hover(item, monitor) {
            if (!ref.current) return;
            
            const dragIndex = item.index;
            const hoverIndex = index;
            
            if (dragIndex === hoverIndex) return;
            
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
            
            moveProduct(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const resetearEstado = useCallback(() => {
        clearTimeout(delayRef.current);
        clearTimeout(favoritoRef.current);
        cancelAnimationFrame(animationFrameRef.current);

        delayRef.current = null;
        favoritoRef.current = null;
        animationFrameRef.current = null;
        clickInicialRef.current = null;
        estaActivoRef.current = false;

        setMostrarProgreso(false);
        setTiempoPresionado(0);
        setEstaActivo(false);
    }, []);

    useEffect(() => resetearEstado, [resetearEstado]);

    const handleMouseDown = (e) => {
        // Solo inicia el arrastre si no es un click derecho
        if (e.button !== 0) return;

        resetearEstado();
        clickInicialRef.current = Date.now();
        estaActivoRef.current = true;
        superoUmbralRef.current = false;
        setEstaActivo(true);

        delayRef.current = setTimeout(() => {
            // Solo activa el drag si se mantuvo presionado suficiente tiempo
            if (!estaActivoRef.current) return;

            setMostrarProgreso(true);
            superoUmbralRef.current = true;
            const startTime = Date.now();

            const actualizarProgreso = () => {
                if (!estaActivoRef.current) return;

                const elapsed = Date.now() - startTime;
                setTiempoPresionado(Math.min((elapsed / 3000) * 100, 100));
                if (elapsed < 3000) {
                    animationFrameRef.current = requestAnimationFrame(actualizarProgreso);
                }
            };

            actualizarProgreso();

            favoritoRef.current = setTimeout(async () => {
                if (!estaActivoRef.current) return;

                resetearEstado();
                await toggleFavorito(producto);
            }, 3000);
        }, 200);
    };

    const handleMouseUp = () => {
        const tiempoTranscurrido = clickInicialRef.current
            ? Date.now() - clickInicialRef.current
            : 0;

        // Solo agrega al carrito si fue un click rápido y no se superó el umbral de arrastre
        if (tiempoTranscurrido < 200 && !superoUmbralRef.current && !isDragging) {
            agregar(producto);
        }

        resetearEstado();
    };

    const handleMouseLeave = () => {
        resetearEstado();
    };

    // Color del glow (ajustado para combinar con el naranja/azul)
    const glowColor = theme.palette.mode === 'dark'
        ? '#ff6d2a' // naranja brillante en modo oscuro
        : '#b0adff'; // azul claro en modo claro

    return (
        <Card
            ref={ref}
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
                backgroundColor: producto.favorito
                    ? 'linear-gradient(135deg, #e35305 0%, #ff8c00 100%)'
                    : theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #1a0b2e 0%, #2d0b5e 100%)'
                        : '#ffffff',
                color: producto.favorito
                    ? '#ffffff'
                    : theme.palette.mode === 'dark'
                        ? '#ffb347'
                        : '#050316',
                overflow: 'visible',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isDragging 
                    ? 'scale(0.9) rotate(5deg)' 
                    : estaActivo 
                        ? 'scale(0.95)' 
                        : 'scale(1)',
                opacity: isDragging ? 0.7 : 1,
                boxShadow: isDragging 
                    ? `0 0 30px 15px rgba(163, 53, 238, 0.9)`
                    : estaActivo
                        ? `0 0 30px 15px rgba(163, 53, 238, 0.7)`
                        : `0 5px 15px ${theme.palette.mode === 'dark' ? 'rgba(163, 53, 238, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
                border: producto.favorito
                    ? 'none'
                    : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(227, 83, 5, 0.3)' : '#e0e0e0'}`,
                '&:hover': {
                    transform: isDragging ? 'scale(0.9) rotate(5deg)' : 'scale(1.1)',
                    zIndex: 10,
                    boxShadow: `0 0 25px 10px rgba(163, 53, 238, 0.9)`,
                    background: producto.favorito
                        ? 'linear-gradient(135deg, #ff6d2a 0%, #ff9e00 100%)'
                        : theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #2d0b5e 0%, #4a1b9e 100%)'
                            : '#f5f5ff',
                },
                '&:active': {
                    transform: 'scale(0.90)',
                },
                '&::before': producto.favorito ? {} : {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(227, 83, 5, 0.1) 0%, transparent 50%)',
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                }
            }}
               onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
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
                        color: producto.favorito ? '#ffffff' : theme.palette.mode === 'dark' ? '#ffffff' : '#050316',
                    }}
                >
                    ${producto.precio.toLocaleString('es-AR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}
                </Typography>
            </Box>
        </Card>
    );
};

export default ProductoCard;
