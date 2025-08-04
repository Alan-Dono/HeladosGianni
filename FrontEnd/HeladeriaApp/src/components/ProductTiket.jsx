// src/components/ProductoCard.js
import React from 'react';
import { Card, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const ProductTiket = ({ producto, agregar, restar, eliminar }) => {
    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                p: 1,
                width: '100%', // Tarjeta ocupa todo el ancho
                boxShadow: 2,
                borderRadius: 2,
                height: '70px', // Altura fija para todas las tarjetas
            }}
        >
            {/* Información del producto */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2">{producto.nombreProducto}</Typography>
                <Typography variant="body2">${producto.precio} x {producto.cantidad}</Typography>
            </Box>

            {/* Botones de agregar/restar */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton onClick={() => restar(producto.id)} size="small">
                    <RemoveIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>{producto.cantidad}</Typography>
                <IconButton onClick={() => agregar(producto)} size="small">
                    <AddIcon />
                </IconButton>
            </Box>

            {/* Botón de eliminar, siempre visible */}
            {eliminar && (
                <IconButton color="error" onClick={() => eliminar(producto.id)} size="small" sx={{ ml: 1 }}>
                    <DeleteIcon />
                </IconButton>
            )}
        </Card>
    );
};

export default ProductTiket;
