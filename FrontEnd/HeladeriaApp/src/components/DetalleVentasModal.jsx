import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import VentaService from '../services/VentaService';

const DetalleCompraModal = ({ abierto, cerrar, venta }) => {
  const [ventaDetalle, setVentaDetalle] = useState(null);

  useEffect(() => {
    const cargarVentaDetalle = async () => {
      if (abierto && venta) {
        try {
          const response = await VentaService.obtenerPorId(venta.id);
          setVentaDetalle(response);
        } catch (error) {
          console.error('Error al cargar el detalle de la venta:', error);
        }
      }
    };
    cargarVentaDetalle();
  }, [abierto, venta]);

  if (!ventaDetalle) return null;

  return (
    <Modal
      open={abierto}
      onClose={cerrar}
      aria-labelledby="detalle-compra-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Detalle de la Compra N° {ventaDetalle.id}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Fecha y hora: {new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(ventaDetalle.fechaDeVenta))}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Mostrar productos normales */}
            {ventaDetalle.detalleVenta?.map((detalle, index) => (
              <TableRow key={`normal-${index}`}>
                <TableCell>{detalle.producto?.nombreProducto || 'Producto no disponible'}</TableCell>
                <TableCell>{detalle.cantidad}</TableCell>
                <TableCell>${detalle.precioUnitario.toFixed(2)}</TableCell>
                <TableCell>${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}</TableCell>
              </TableRow>
            ))}

            {/* Mostrar conceptos varios */}
            {ventaDetalle.conceptosVarios?.map((concepto, index) => (
              <TableRow key={`vario-${index}`}>
                <TableCell>{concepto.nombre}</TableCell>
                <TableCell>1</TableCell> {/* Cantidad fija en 1 para productos varios */}
                <TableCell>${concepto.precio.toFixed(2)}</TableCell>
                <TableCell>${concepto.precio.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={4} display="flex" justifyContent="space-between">
          <Typography variant="subtitle1">
            Descuento: ${ventaDetalle.descuentos?.toFixed(2) || '0.00'}
          </Typography>
          <Typography variant="h6">
            Total: ${ventaDetalle.totalVenta.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default DetalleCompraModal;