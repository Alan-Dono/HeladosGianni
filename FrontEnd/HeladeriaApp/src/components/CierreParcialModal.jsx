import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const CierreParcialModal = ({ open, onClose, onCierreParcial, turnoActual }) => {
    const handleCierreParcial = () => {
        onCierreParcial();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Cierre Parcial</DialogTitle>
            <DialogContent>
                <Typography>Responsable: {turnoActual?.responsableActual}</Typography>
                <Typography>Total de ventas: ${turnoActual?.ventas.reduce((sum, venta) => sum + venta.monto, 0).toFixed(2)}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleCierreParcial}>Realizar Cierre Parcial</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CierreParcialModal;