// components/AclaracionModal.jsx
import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const AclaracionModal = ({ open, onClose, onSave, tipo }) => {
  const [aclaracion, setAclaracion] = useState('');

  const handleChange = (event) => {
    setAclaracion(event.target.value);
  };

  const handleSave = () => {
    onSave(aclaracion);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          <Button variant="outlined" onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AclaracionModal;
