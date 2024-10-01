import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

const HistorialTurnosTable = ({ turnos }) => {
    const calcularTotalVentas = (turno) => {
        let total = turno.ventas.reduce((sum, venta) => sum + venta.monto, 0);
        turno.cierresParciales.forEach(cierre => {
            total += cierre.ventas.reduce((sum, venta) => sum + venta.monto, 0);
        });
        return total.toFixed(2);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha Inicio</TableCell>
                        <TableCell>Fecha Fin</TableCell>
                        <TableCell>Responsable Inicial</TableCell>
                        <TableCell>Responsable Final</TableCell>
                        <TableCell>Total Ventas</TableCell>
                        <TableCell>Detalles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {turnos.map((turno, index) => (
                        <TableRow key={index}>
                            <TableCell>{turno.fechaInicio.toLocaleString()}</TableCell>
                            <TableCell>{turno.fechaFin.toLocaleString()}</TableCell>
                            <TableCell>{turno.responsableInicial}</TableCell>
                            <TableCell>{turno.responsableActual}</TableCell>
                            <TableCell>${calcularTotalVentas(turno)}</TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    Cierres Parciales: {turno.cierresParciales.length}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default HistorialTurnosTable;