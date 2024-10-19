
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal
} from '@mui/material';



// Componente para el modal de detalles de ventas
const DetallesVentasModal = ({ abierto, cerrar, turnoId }) => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    if (abierto) {
      cargarVentas();
    }
  }, [abierto, turnoId]);

  const cargarVentas = async () => {
    // Aquí deberías implementar la lógica para obtener las ventas del turno
    // Por ejemplo: const ventasTurno = await VentaService.obtenerVentasPorTurno(turnoId);
    // setVentas(ventasTurno);
  };

  return (
    <Modal open={abierto} onClose={cerrar}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2">
          Detalle de Ventas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>{venta.id}</TableCell>
                  <TableCell>{new Date(venta.fecha).toLocaleString()}</TableCell>
                  <TableCell>{venta.descuento}</TableCell>
                  <TableCell>{venta.total}</TableCell>
                  <TableCell>{venta.estado ? 'Activa' : 'Anulada'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default DetallesVentasModal;