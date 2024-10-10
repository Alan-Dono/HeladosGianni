import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const CierreParcialModal = ({ open, onClose, onCierreParcial, turnoActual }) => {
    const handleCierre = () => {
        onCierreParcial();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6">Realizar Cierre Parcial</Typography>
                <Typography variant="body1">¿Está seguro que desea realizar un cierre parcial?</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Responsable Actual: {turnoActual?.responsableActual}
                </Typography>
                <Button variant="contained" onClick={handleCierre} sx={{ mt: 2 }}>
                    Confirmar Cierre Parcial
                </Button>
            </Box>
        </Modal>
    );
};

export default CierreParcialModal;
