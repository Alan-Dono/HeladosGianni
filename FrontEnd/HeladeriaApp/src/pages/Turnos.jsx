import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import turnoService from '../services/TurnoService';
import VentaService from '../services/VentaService';

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarAbierto, setSnackbarAbierto] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('success');

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const turnosData = await turnoService.obtenerTodos();
      setTurnos(turnosData);
    } catch (error) {
      console.error('Error al obtener los turnos', error);
    }
  };

  const handleDeleteClick = async (row) => {
    setSelectedTurno(row);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await eliminarTurno(selectedTurno.id);
      fetchTurnos();
      setOpenDeleteDialog(false);
      setMensajeSnackbar('Turno eliminado exitosamente');
      setTipoAlerta('success');
      setSnackbarAbierto(true);
    } catch (error) {
      setMensajeSnackbar('Error al eliminar el turno');
      setTipoAlerta('error');
      setSnackbarAbierto(true);
    }
  };

  const cerrarAlerta = () => {
    setSnackbarAbierto(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.2 },
    { field: 'fechaInicio', headerName: 'Fecha de Inicio', flex: 1, valueGetter: (params) => new Date(params.row.fechaInicio).toLocaleDateString() },
    { field: 'fechaFin', headerName: 'Fecha de Fin', flex: 1, valueGetter: (params) => new Date(params.row.fechaFin).toLocaleDateString() },
    { field: 'encargado', headerName: 'Encargado/a', flex: 1, valueGetter: (params) => params.row.encargado || 'N/A' },
    { field: 'totales', headerName: 'Total', flex: 0.5, valueGetter: (params) => params.row.totales ? `$${params.row.totales.toFixed(2)}` : 'N/A' },
    { field: 'descuentos', headerName: 'Descuento', flex: 0.5, valueGetter: (params) => params.row.descuentos ? `$${params.row.descuentos.toFixed(2)}` : 'Sin descuento' },
    { field: 'detalle', headerName: 'Detalle', flex: 2, valueGetter: (params) => params.row.detalle || 'Sin detalles' },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => console.log('Editar', params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Typography variant="h4" mb={2}>Gestión de Turnos y Ventas</Typography>

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} md={6}>
          <TextField
            variant="outlined"
            placeholder="Buscar turno o venta"
            fullWidth
          // Implementar funcionalidad de búsqueda
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button variant="contained" color="primary" startIcon={<Add />} size="large">
              Agregar Turno
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, height: 'calc(100% - 120px)', width: '100%' }}>
        <DataGrid
          rows={turnos}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 15]}
          autoHeight
        />
      </Box>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este turno?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarAbierto} autoHideDuration={3000} onClose={cerrarAlerta} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MuiAlert elevation={6} variant="filled" severity={tipoAlerta} onClose={cerrarAlerta}>
          {mensajeSnackbar}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Turnos;
