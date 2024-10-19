import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import CierreCajaService from '../services/CierreCajaService';
import EmpleadoService from '../services/EmpleadoService';
import TurnoService from '../services/TurnoService';

const PanelCierre = ({ onUpdate }) => {
  const [turnoActual, setTurnoActual] = useState(null);
  const [cierreActual, setCierreActual] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [dialogoCambioAbierto, setDialogoCambioAbierto] = useState(false);
  const [dialogoFinalizarAbierto, setDialogoFinalizarAbierto] = useState(false);

  useEffect(() => {
    cargarEmpleados();
    cargarTurnoActual();
  }, []);

  useEffect(() => {
    if (turnoActual) {
      cargarCierreActual();
    }
  }, [turnoActual]);

  const cargarEmpleados = async () => {
    try {
      const listaEmpleados = await EmpleadoService.obtenerEmpleados();
      setEmpleados(listaEmpleados);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const cargarTurnoActual = async () => {
    try {
      const turno = await TurnoService.obtenerTurnoActivo();
      setTurnoActual(turno);
    } catch (error) {
      console.error('Error al cargar turno actual:', error);
    }
  };

  const cargarCierreActual = async () => {
    try {
      const cierreData = await CierreCajaService.obtenerActivo();
      setCierreActual(cierreData);
    } catch (error) {
      console.error("Error al cargar cierre actual", error);
    }
  };

  const iniciarTurno = async () => {
    if (empleadoSeleccionado) {
      try {
        const nuevoTurno = await CierreCajaService.iniciar({ idEmpleado: empleadoSeleccionado });
        setModalAbierto(false);
        await cargarTurnoActual(); // Cargar el nuevo turno
        await cargarCierreActual(); // Cargar el cierre actual
        onUpdate(); // Llamar a la función de actualización
      } catch (error) {
        console.error('Error al iniciar turno:', error);
      }
    }
  };


  const cambiarResponsable = async () => {
    if (empleadoSeleccionado) {
      try {
        await CierreCajaService.cambiarResponsable(cierreActual.id, { IdTurno: turnoActual.id, IdEmpleado: empleadoSeleccionado });
        cargarCierreActual();
        setDialogoCambioAbierto(false);
        onUpdate(); // Llamar a la función de actualización
      } catch (error) {
        console.error('Error al cambiar responsable:', error);
      }
    }
  };

  const finalizarTurno = async () => {
    if (turnoActual) {
      try {
        await TurnoService.finalizar(turnoActual.id);
        setTurnoActual(null);
        setCierreActual(null);
        setDialogoFinalizarAbierto(false);
        onUpdate(); // Llamar a la función de actualización
      } catch (error) {
        console.error('Error al finalizar turno:', error);
      }
    }
  };
  console.log('cierreACtual', cierreActual);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
        {turnoActual && cierreActual ? (
          <>
            <Box>
              <Typography variant="h6">Turno Activo #{turnoActual.id}</Typography>
              <Typography>
                Inicio: {new Date(cierreActual.fechaInicio).toLocaleString('es-AR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>

              <Typography>Responsable: {cierreActual.empleado.nombreEmpleado + " " + cierreActual.empleado.apellidoEmpleado} </Typography>
            </Box>
            <Box>
              <Typography>Ventas: {cierreActual.cantidadDeVentas}</Typography>
              <Typography>Descuento Total: ${cierreActual.totalDescuentos}</Typography>
              <Typography>Total: ${cierreActual.totalDeVentas}</Typography>
            </Box>
            <Box>
              <Button variant="contained" onClick={() => setDialogoCambioAbierto(true)} sx={{ mr: 1 }}>
                Cambiar Responsable
              </Button>
              <Button variant="contained" color="secondary" onClick={() => setDialogoFinalizarAbierto(true)}>
                Finalizar Turno
              </Button>
            </Box>
          </>
        ) : (
          <Button variant="contained" onClick={() => setModalAbierto(true)}>
            Iniciar Turno
          </Button>
        )}
      </Box>

      {/* Modal para seleccionar empleado al iniciar turno */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Seleccionar Empleado
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Empleado</InputLabel>
            <Select
              value={empleadoSeleccionado}
              onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            >
              {empleados.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>{`${emp.nombreEmpleado} ${emp.apellidoEmpleado}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={iniciarTurno} fullWidth>
            Iniciar Turno
          </Button>
        </Box>
      </Modal>

      {/* Diálogo para cambiar responsable */}
      <Dialog open={dialogoCambioAbierto} onClose={() => setDialogoCambioAbierto(false)}>
        <DialogTitle>Cambiar Responsable</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nuevo Responsable</InputLabel>
            <Select
              value={empleadoSeleccionado}
              onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            >
              {empleados.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>{`${emp.nombreEmpleado} ${emp.apellidoEmpleado}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoCambioAbierto(false)}>Cancelar</Button>
          <Button onClick={cambiarResponsable} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar finalización de turno */}
      <Dialog open={dialogoFinalizarAbierto} onClose={() => setDialogoFinalizarAbierto(false)}>
        <DialogTitle>Finalizar Turno</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea finalizar el turno actual?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoFinalizarAbierto(false)}>Cancelar</Button>
          <Button onClick={finalizarTurno} variant="contained" color="secondary">Finalizar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PanelCierre;