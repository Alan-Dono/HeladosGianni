import React from 'react';
import { Card, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const ProductTiket = ({ producto, agregar, restar, eliminar }) => {
    // Obtener el nombre según el tipo de producto
    const nombre = producto.nombreProducto || producto.nombre || "Producto";

    // Función para manejar la resta
    const handleRestar = () => {
        if (producto.esVario) {
            restar(producto); // Pasamos el producto completo para varios
        } else {
            restar(producto.id); // Pasamos solo el ID para productos normales
        }
    };

    // Función para manejar la eliminación
    const handleEliminar = () => {
        if (producto.esVario) {
            eliminar(producto); // Pasamos el producto completo para varios
        } else {
            eliminar(producto.id); // Pasamos solo el ID para productos normales
        }
    };

    return (
        <Card sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
            p: 1,
            width: '100%',
            boxShadow: 2,
            borderRadius: 2,
            height: '70px',
        }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2">{nombre}</Typography>
                <Typography variant="body2">${producto.precio} x {producto.cantidad}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton onClick={handleRestar} size="small">
                    <RemoveIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>{producto.cantidad}</Typography>
                <IconButton onClick={() => agregar(producto)} size="small">
                    <AddIcon />
                </IconButton>
            </Box>

            <IconButton color="error" onClick={handleEliminar} size="small" sx={{ ml: 1 }}>
                <DeleteIcon />
            </IconButton>
        </Card>
    );
};

export default ProductTiket;