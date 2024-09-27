// src/components/Categoria.js
import React, { useState } from 'react';
import { Card, CardContent, Box } from '@mui/material';
import ProductoCard from './ProductoCard';
import { useTheme } from '@emotion/react';

const Categoria = ({ nombreCategoria, productos, agregar }) => {

    const [isHovered, setIsHovered] = useState(false);
    const theme = useTheme();

    return (
        <Card
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                zIndex: isHovered ? 2 : 'auto',
                '&:hover': {
                    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                },
                backgroundColor: theme.palette.background.paper
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardContent sx={{ height: '100%', overflow: 'hidden', p: 0 }}> {/* Ajustar padding */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    {productos.map((producto) => (
                        <ProductoCard
                            key={producto.id}
                            producto={producto}
                            agregar={agregar}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Categoria;
