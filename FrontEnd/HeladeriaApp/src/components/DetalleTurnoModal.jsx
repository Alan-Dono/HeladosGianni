import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal
} from '@mui/material';
import DetallesVentasModal from './DetalleVentasModal';




// Componente para el modal de detalles del turno
const DetalleTurnoModal = ({ abierto, cerrar, turno }) => {
  const [modalVentasAbierto, setModalVentasAbierto] = useState(false);

  if (!turno) return null;

  return (
    <Modal open={abierto} onClose={cerrar}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2">
          Detalles del Turno
        </Typography>
        <Typography>ID: {turno.id}</Typography>
        <Typography>Fecha Inicio: {new Date(turno.fechaInicio).toLocaleString()}</Typography>
        <Typography>Fecha Fin: {turno.fechaFin ? new Date(turno.fechaFin).toLocaleString() : 'En curso'}</Typography>
        <Typography>Empleado: {turno.empleadoNombre}</Typography>
        <Typography>Cantidad de Ventas: {turno.cantidadVentas}</Typography>
        <Typography>Descuentos: {turno.descuentosTotales}</Typography>
        <Typography>Total: {turno.total}</Typography>
        <Button onClick={() => setModalVentasAbierto(true)}>Ver Detalle de Ventas</Button>
        <DetallesVentasModal
          abierto={modalVentasAbierto}
          cerrar={() => setModalVentasAbierto(false)}
          turnoId={turno.id}
        />
      </Box>
    </Modal>
  );
};


export default DetalleTurnoModal;