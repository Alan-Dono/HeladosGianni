import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VentaService from '../services/VentaService';
import DetalleVentasModal from './DetalleVentasModal';
import VisibilityIcon from '@mui/icons-material/Visibility';

const DetalleCierreModal = ({ abierto, cerrar, cierre }) => {
  const [modalVentaAbierto, setModalVentaAbierto] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventas, setVentas] = useState([]);



  useEffect(() => {
    const cargarDetalles = async () => {
      if (abierto && cierre) {
        try {
          const response = await VentaService.obtenerPorCierreCaja(cierre.id);
          setVentas(response);
        } catch (error) {
          console.error('Error al cargar los detalles:', error);
        }
      }
    };

    cargarDetalles();
  }, [abierto, cierre]);

  const columns = [
    {
      field: 'id',
      headerName: 'N° Venta',
      width: 90,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'fechaDeVenta',
      headerName: 'Fecha Venta',
      flex: 1,
      valueGetter: (params) => {
        if (!params) return '';
        return new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(params));
      },
    },
    {
      field: 'descuentos',
      headerName: 'Descuentos',
      flex: 1,
      valueFormatter: (params) => {
        return params ? params.toFixed(2) : '0.00'; // Formatea el valor a dos decimales
      },
    },
    {
      field: 'totalVenta',
      headerName: 'Importe',
      flex: 1,
      valueFormatter: (params) => {
        return params ? params.toFixed(2) : '0.00'; // Formatea el valor a dos decimales
      },
    },
    {
      field: 'activa',
      headerName: 'Estado',
      flex: 1,
      valueFormatter: (params) => {
        return params ? 'Activa' : 'Anulada'
      }
    },
    {
      field: 'verDetalles',
      headerName: 'Detalles',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            setVentaSeleccionada(params.row); // Selecciona el cierr
            setModalVentaAbierto(true); // Abre el modal
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    }
  ];

  console.log('VentaSelec', ventaSeleccionada);


  return (
    <>
      <Modal
        open={abierto}
        onClose={cerrar}
        aria-labelledby="detalle-venta-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 900,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Detalle de la caja N°{ }
          </Typography>

          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={ventas}
              columns={columns}
              disableSelectionOnClick
              getRowId={(row) => row.id}
            />
          </Box>
        </Box>
      </Modal>

      <DetalleVentasModal
        abierto={modalVentaAbierto}
        cerrar={() => {
          setModalVentaAbierto(false);
          setVentaSeleccionada(null);
        }}
        venta={ventaSeleccionada}
      />

    </>

  );
};

export default DetalleCierreModal;