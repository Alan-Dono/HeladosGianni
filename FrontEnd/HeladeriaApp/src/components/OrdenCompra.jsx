// src/components/OrdenCompra.js
import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import ProductTiket from './ProductTiket';

const OrdenCompra = ({ carrito, subtotal, descuento, total, setDescuento, agregar, restar, eliminar }) => {
    return (
        <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%', width: '100%' }}>
            <Typography variant="h5" gutterBottom>Pedido</Typography>
            {carrito.length > 0 ? (
                carrito.map((producto) => (
                    <ProductTiket
                        key={producto.id}
                        producto={producto}
                        agregar={agregar}
                        restar={restar}
                        eliminar={eliminar}
                    />
                ))
            ) : (
                <Typography>Tu carrito está vacío.</Typography>
            )}
            <Box sx={{ mt: 3 }}>
                <TextField
                    label="Descuento"
                    type="number"
                    value={descuento}
                    onChange={(e) => setDescuento(e.target.value)}
                    fullWidth
                    margin="dense"
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Subtotal: ${subtotal}</Typography>
                <Typography variant="body1">Descuento: ${descuento}</Typography>
                <Typography variant="h6">Total: ${total}</Typography>
            </Box>
        </Box>
    );
};

export default OrdenCompra;
