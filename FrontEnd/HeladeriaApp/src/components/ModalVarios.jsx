import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const ModalVarios = ({ open, onClose, onSave, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [error, setError] = useState('');

  // Reset interno siempre que se cierre
  useEffect(() => {
    if (!open) {
      setNombre('');
      setPrecio('');
      setError('');
    }
  }, [open]);

  const handleSave = () => {
    if (!nombre.trim() || !precio) {
      setError('Por favor complete todos los campos');
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum)) {
      setError('El precio debe ser un número válido');
      return;
    }

    onSave({
      id: `vario-${Date.now()}`,
      nombre: nombre.trim(),
      precio: precioNum,
      cantidad: 1,
      esVario: true // Marcar como producto vario
    });
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="modal-varios-title"
      aria-describedby="modal-varios-description"
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
        <Typography variant="h6" id="modal-varios-title" sx={{ mb: 2 }}>
          Agregar Producto Varios
        </Typography>

        <TextField
          fullWidth
          label="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
          inputProps={{ step: "0.01" }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Agregar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalVarios;