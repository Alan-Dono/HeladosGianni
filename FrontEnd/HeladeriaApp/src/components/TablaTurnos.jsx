import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DetalleTurnoModal from './DetalleTurnosModal';

const TablaTurnos = ({
  turnos,
  rowCount,
  paginationModel,
  onPaginationModelChange,
}) => {

  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const columns = [
    { field: 'id', headerName: 'Turno', width: 70 },
    {
      field: 'fechaInicio',
      headerName: 'Fecha Inicio',
      flex: 1,
      valueGetter: (value) => {
        if (!value) return '';
        return new Intl.DateTimeFormat('es-ES', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        }).format(new Date(value));
      },
    },
    {
      field: 'fechaFin',
      headerName: 'Fecha Fin',
      flex: 1,
      valueGetter: (value) => {
        if (!value) return 'En curso';
        return new Intl.DateTimeFormat('es-ES', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        }).format(new Date(value));
      },
    },
    { field: 'cantidadCierresParciales', headerName: 'Cant. Cierres', flex: 1 },
    { field: 'cantidadDeVentas', headerName: 'Cant. Ventas', flex: 1 },
    {
      field: 'totalDescuentos',
      headerName: 'Descuentos',
      flex: 1,
      valueFormatter: (v) =>
        v ? v.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '0,00',
    },
    {
      field: 'totalVentas',
      headerName: 'Total',
      flex: 1,
      valueFormatter: (v) =>
        v ? v.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '0,00',
    },
    {
      field: 'verDetalles',
      headerName: 'Detalles',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            console.log('🔍 Turno seleccionado:', params.row); // Debug
            setTurnoSeleccionado(params.row); // ✅ Pasar el objeto completo, no solo el ID
            setModalAbierto(true);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={turnos}
        columns={columns}
        getRowId={(row) => row.id}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[25, 50, 100]}
        localeText={{
          MuiTablePagination: { labelRowsPerPage: 'Registros por página:' },
          noRowsLabel: 'Sin registros',
        }}
      />

      <DetalleTurnoModal
        abierto={modalAbierto}
        cerrar={() => {
          setModalAbierto(false);
          setTurnoSeleccionado(null);
        }}
        turno={turnoSeleccionado}
      />
    </Box>
  );
};

export default TablaTurnos;