import React, { useState } from 'react';
import { Card, IconButton, Typography, Box, Modal, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import NoteIcon from '@mui/icons-material/Note';

const ProductTiket = ({ producto, agregar, restar, eliminar, actualizarAclaracion }) => {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [aclaracionTemp, setAclaracionTemp] = useState(producto.aclaracion || "");

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

    // Función para abrir el modal de aclaración
    const handleAbrirModal = () => {
        setAclaracionTemp(producto.aclaracion || "");
        setModalAbierto(true);
    };

    // Función para guardar la aclaración
    const handleGuardarAclaracion = () => {
        const aclaracionLimpia = aclaracionTemp.trim().toUpperCase();
        if (producto.esVario) {
            actualizarAclaracion(producto, aclaracionLimpia);
        } else {
            actualizarAclaracion(producto.id, aclaracionLimpia);
        }
        setModalAbierto(false);
    };

    // Función para cancelar
    const handleCancelar = () => {
        setModalAbierto(false);
    };

    return (
        <>
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
                    {producto.aclaracion && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Nota: {producto.aclaracion}
                        </Typography>
                    )}
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

                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                    <IconButton
                        onClick={handleAbrirModal}
                        size="small"
                        sx={{
                            color: producto.aclaracion ? 'primary.main' : 'text.secondary',
                            '&:hover': { color: 'primary.main' }
                        }}
                    >
                        <NoteIcon />
                    </IconButton>
                    <IconButton color="error" onClick={handleEliminar} size="small">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Card>

            {/* Modal para editar aclaración */}
            <Modal
                open={modalAbierto}
                onClose={handleCancelar}
                aria-labelledby="modal-aclaracion"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    width: '300px',
                    borderRadius: '8px',
                }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Agregar nota a {nombre}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Nota o aclaración"
                        value={aclaracionTemp}
                        onChange={(e) => setAclaracionTemp(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                        inputProps={{ maxLength: 100 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={handleCancelar}>
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleGuardarAclaracion}>
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ProductTiket;