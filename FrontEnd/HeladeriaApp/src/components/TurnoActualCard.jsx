import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const TurnoActualCard = ({ turno, onCambiarResponsable, onCierreParcial, onFinalizarTurno }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Turno Actual</Typography>
                <Typography>Responsable Inicial: {turno.responsableInicial}</Typography>
                <Typography>Responsable Actual: {turno.responsableActual}</Typography>
                <Typography>Fecha de Inicio: {turno.fechaInicio.toLocaleString()}</Typography>
                <Typography>Total de ventas: ${turno.ventas.reduce((sum, venta) => sum + venta.monto, 0).toFixed(2)}</Typography>
                <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" onClick={onCambiarResponsable} sx={{ mr: 1 }}>
                        Cambiar Responsable
                    </Button>
                    <Button variant="outlined" onClick={onCierreParcial} sx={{ mr: 1 }}>
                        Cierre Parcial
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onFinalizarTurno}>
                        Finalizar Turno
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TurnoActualCard;