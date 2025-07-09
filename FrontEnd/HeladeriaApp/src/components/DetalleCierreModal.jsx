import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VentaService from '../services/VentaService';
import CierreCajaService from '../services/CierreCajaService';
import DetalleVentasModal from './DetalleVentasModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';

const DetalleCierreModal = ({ abierto, cerrar, cierre }) => {
  const [modalVentaAbierto, setModalVentaAbierto] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [cargandoImpresion, setCargandoImpresion] = useState(false);
  const [alerta, setAlerta] = useState({ abierta: false, mensaje: '', tipo: 'success' });

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

  const manejarImpresion = async () => {
    if (!cierre?.id) return;

    setCargandoImpresion(true);
    try {
      await CierreCajaService.imprimirResumen(cierre.id);
      setAlerta({
        abierta: true,
        mensaje: 'Resumen de cierre enviado a la impresora exitosamente.',
        tipo: 'success'
      });
    } catch (error) {
      console.error('Error al imprimir resumen:', error);
      setAlerta({
        abierta: true,
        mensaje: 'Error al imprimir el resumen del cierre.',
        tipo: 'error'
      });
    } finally {
      setCargandoImpresion(false);
    }
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, abierta: false });
  };

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Detalle de la caja N°{cierre?.id || ''}
            </Typography>

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={manejarImpresion}
              disabled={cargandoImpresion || !cierre?.id}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {cargandoImpresion ? 'Imprimiendo...' : 'Imprimir Resumen'}
            </Button>
          </Box>

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

      <Snackbar
        open={alerta.abierta}
        autoHideDuration={4000}
        onClose={cerrarAlerta}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={cerrarAlerta}
          severity={alerta.tipo}
          sx={{ width: '100%' }}
        >
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DetalleCierreModal;