import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const FinalizarTurnoModal = ({ open, onClose, onFinalizarTurno, turnoActual }) => {
    const handleFinalizar = () => {
        onFinalizarTurno();
    };
    console.log("log de turno actual en finalizar", turnoActual);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6">Finalizar Turno</Typography>
                <Typography variant="body1">¿Está seguro que desea finalizar el turno?</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Responsable Actual: {turnoActual?.responsableActual}
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleFinalizar} sx={{ mt: 2 }}>
                    Confirmar Finalización
                </Button>
            </Box>
        </Modal>
    );
};

export default FinalizarTurnoModal;
