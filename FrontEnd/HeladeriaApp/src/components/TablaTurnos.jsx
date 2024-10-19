import React, { useState } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DetalleTurnoModal from './DetalleTurnoModal';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const TablaTurnos = ({ turnos, onUpdate }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
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
    { field: 'cantidadCierresParciales', headerName: 'Cant. Cierres', flex: 1 },
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
      field: 'totalVentas',
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
            setTurnoSeleccionado(params.row);
            setModalAbierto(true);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const handleRowClick = (params) => {
    // Solo marca visualmente la fila sin seleccionar
    setTurnoSeleccionado(params.row);
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={turnos}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        onRowClick={handleRowClick} // Mantiene la función para marcar la fila visualmente
        getRowId={(row) => row.id} // Asegúrate de que haya una propiedad única para cada fila
      />
      <DetalleTurnoModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        turno={turnoSeleccionado}
        onUpdate={onUpdate}
      />
    </Box>
  );
};

export default TablaTurnos;
