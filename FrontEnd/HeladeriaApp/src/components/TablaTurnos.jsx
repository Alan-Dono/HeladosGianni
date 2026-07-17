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
      minWidth: 150,
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
      minWidth: 150,
      valueGetter: (value) => {
        if (!value) return 'En curso';
        return new Intl.DateTimeFormat('es-ES', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        }).format(new Date(value));
      },
    },
    { field: 'cantidadCierresParciales', headerName: 'Cant. Cierres', width: 120 },
    { field: 'cantidadDeVentas', headerName: 'Cant. Ventas', width: 120 },
    {
      field: 'totalDescuentos',
      headerName: 'Descuentos',
      width: 120,
      valueFormatter: (v) =>
        v ? v.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '0,00',
    },
    {
      field: 'totalVentas',
      headerName: 'Total',
      width: 120,
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
            setTurnoSeleccionado(params.row);
            setModalAbierto(true);
          }}
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Contenedor principal que ocupa todo el espacio */}
      <Box sx={{ 
        flex: 1,
        width: '100%',
        position: 'relative'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
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
            sx={{
              flex: 1,
              width: '100%',
              '& .MuiDataGrid-virtualScroller': {
                minHeight: '50px'
              }
            }}
          />
        </Box>
      </Box>

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