// DetalleCierreModal.jsx
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import { DataGrid } from '@mui/x-data-grid';
import CierreCajaService from '../services/CierreCajaService';
import TurnoService from '../services/TurnoService';
import DetalleCierreModal from './DetalleCierreModal';


const DetalleTurnoModal = ({ abierto, cerrar, turno }) => {
  const [cierres, setCierres] = useState([]);
  const [cierreSeleccionado, setCierreSeleccionado] = useState(null);
  const [modalVentaAbierto, setModalVentaAbierto] = useState(false);
  const [cargandoImpresion, setCargandoImpresion] = useState(false);
  const [alerta, setAlerta] = useState({ abierta: false, mensaje: '', tipo: 'success' });

  useEffect(() => {
    const cargarCierres = async () => {
      if (abierto && turno) {
        try {
          const response = await CierreCajaService.obtenerPorTurnoId(turno.id);
          setCierres(response);
        } catch (error) {
          console.error('Error al cargar las ventas:', error);
        }
      }
    };

    cargarCierres();
  }, [abierto, turno]);

  const manejarImpresion = async () => {
    if (!turno?.id) return;

    setCargandoImpresion(true);
    try {
      await TurnoService.imprimirResumen(turno.id);
      setAlerta({
        abierta: true,
        mensaje: 'Resumen de turno enviado a la impresora exitosamente.',
        tipo: 'success'
      });
    } catch (error) {
      console.error('Error al imprimir resumen:', error);
      setAlerta({
        abierta: true,
        mensaje: 'Error al imprimir el resumen del turno.',
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
      headerName: 'Caja N°',
      width: 90,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'empleado',
      headerName: 'Encargado',
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      valueGetter: (params) => {
        return params.apellidoEmpleado + " " + params.nombreEmpleado
      }
    },
    {
      field: 'fechaInicio',
      headerName: 'Fecha Inicio',
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
      field: 'fechaFin',
      headerName: 'Fecha Fin',
      flex: 1,
      valueGetter: (params) => {
        if (!params) return 'En curso';
        return new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(params));
      },
    },
    { field: 'cantidadDeVentas', headerName: 'Cant. Ventas', flex: 1 },
    {
      field: 'totalDescuentos',
      headerName: 'Descuentos',
      flex: 1,
      valueFormatter: (params) => {
        return params ? params.toFixed(2) : '0.00'; // Formatea el valor a dos decimales
      },
    },
    {
      field: 'totalDeVentas',
      headerName: 'Total',
      flex: 1,
      valueFormatter: (params) => {
        return params ? params.toFixed(2) : '0.00'; // Formatea el valor a dos decimales
      },
    },
    {
      field: 'verDetalles',
      headerName: 'Detalles',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            setModalVentaAbierto(true);
            setCierreSeleccionado(params.row);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  console.log('DetalleTurno', cierres);

  return (
    <>
      <Modal
        open={abierto}
        onClose={cerrar}
        aria-labelledby="detalle-cierre-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 1200,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Detalle del Turno
            </Typography>

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={manejarImpresion}
              disabled={cargandoImpresion || !turno?.id}
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
              rows={cierres}
              columns={columns}
              disableSelectionOnClick
              getRowId={(row) => row.id}
              sortingMode='client'
              sortingOrder={'desc'}
            />
          </Box>
        </Box>
      </Modal>

      <DetalleCierreModal
        abierto={modalVentaAbierto}
        cerrar={() => {
          setModalVentaAbierto(false);
          setCierreSeleccionado(null);
        }}
        cierre={cierreSeleccionado}
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

export default DetalleTurnoModal;