import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const AclaracionModal = ({ open, onClose, onSave, tipo, onCancel }) => {

  // Reset interno siempre que se cierre
  useEffect(() => {
    if (!open) {
      setAclaracion('');
    }
  }, [open]);


  const [aclaracion, setAclaracion] = useState('');

  const handleChange = (event) => {
    setAclaracion(event.target.value.toUpperCase());
  };

  const handleSave = () => {
    onSave(aclaracion); // Guarda en el estado padre
    onClose();          // El useEffect se encargará del reset interno
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();          // El useEffect se encargará del reset interno
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel} // Usar handleCancel en lugar de onClose directo
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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
        <h2 id="modal-title">{tipo === 'cafeteria' ? 'Aclaración Cafetería' : 'Aclaración Heladería'}</h2>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Escribe tu aclaración"
          value={aclaracion}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AclaracionModal;