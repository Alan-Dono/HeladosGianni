import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const FinalizarTurnoModal = ({ open, onClose, onFinalizarTurno, turnoActual }) => {
    const handleFinalizarTurno = () => {
        onFinalizarTurno();
    };

    const calcularTotalVentas = () => {
        let total = 0;
        if (turnoActual) {
            total += turnoActual.ventas.reduce((sum, venta) => sum + venta.monto, 0);
            turnoActual.cierresParciales.forEach(cierre => {
                total += cierre.ventas.reduce((sum, venta) => sum + venta.monto, 0);
            });
        }
        return total.toFixed(2);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Finalizar Turno</DialogTitle>
            <DialogContent>
                <Typography>Responsable Inicial: {turnoActual?.responsableInicial}</Typography>
                <Typography>Responsable Actual: {turnoActual?.responsableActual}</Typography>
                <Typography>Total de ventas: ${calcularTotalVentas()}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleFinalizarTurno}>Finalizar Turno</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FinalizarTurnoModal;