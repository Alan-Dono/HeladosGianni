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
  DialogTitle,
  TextField
} from '@mui/material';
import CierreCajaService from '../services/CierreCajaService';
import EmpleadoService from '../services/EmpleadoService';
import TurnoService from '../services/TurnoService';
import VentaService from '../services/VentaService';

const PanelCierre = ({ onUpdate }) => {
  const [turnoActual, setTurnoActual] = useState(null);
  const [cierreActual, setCierreActual] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [dialogoCambioAbierto, setDialogoCambioAbierto] = useState(false);
  const [dialogoFinalizarAbierto, setDialogoFinalizarAbierto] = useState(false);
  const [dialogoAnulacionVentaAbierto, setDialogoAnulacionVentaAbierto] = useState(false);
  const [codigoVenta, setCodigoVenta] = useState('');
  const [ventaData, setVentaData] = useState(null);

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

  const cargarVenta = async () => {
    try {
      const venta = await VentaService.obtenerPorId(codigoVenta); // Servicio para obtener la venta por ID
      setVentaData(venta);
    } catch (error) {
      console.error("Error al cargar datos de la venta:", error);
    }
  };

  const anularVenta = async () => {
    try {
      await VentaService.anular(codigoVenta); // Servicio para anular la venta
      setDialogoAnulacionVentaAbierto(false);
      onUpdate(); // Actualizar datos
    } catch (error) {
      console.error("Error al anular venta:", error);
    }
    cargarCierreActual();
  };


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
              <Typography>Responsable: {cierreActual.empleado.nombreEmpleado + " " + cierreActual.empleado.apellidoEmpleado}</Typography>
            </Box>
            <Box>
              <Typography>Ventas: {cierreActual.cantidadDeVentas}</Typography>
              <Typography>Descuento Total: ${cierreActual.totalDescuentos.toFixed(2)}</Typography>
              <Typography>Total: ${cierreActual.totalDeVentas.toFixed(2)}</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={() => setDialogoCambioAbierto(true)}
                sx={{ mr: 1 }}
              >
                Cambiar Responsable
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setDialogoFinalizarAbierto(true)}
                sx={{ mr: 1 }}
              >
                Finalizar Turno
              </Button>
              <Button
                variant="contained"
                color="error" // Color para destacar el botón de anulación
                onClick={() => setDialogoAnulacionVentaAbierto(true)} // Definir el estado de anulación aquí
              >
                Anular Venta
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

      {/* Diálogo para anular una venta */}
      <Dialog open={dialogoAnulacionVentaAbierto} onClose={() => setDialogoAnulacionVentaAbierto(false)}>
        <DialogTitle>Anular Venta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingrese el código de la venta que desea anular.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Código de Venta"
            fullWidth
            value={codigoVenta}
            onChange={(e) => setCodigoVenta(e.target.value)}
          />
          <Button onClick={cargarVenta} variant="contained" color="primary" sx={{ mt: 2 }}>
            Buscar Venta
          </Button>
          {ventaData && cierreActual (
            <Box sx={{ mt: 2 }}>
              <Typography>Responsable: {cierreActual.empleado.nombreEmpleado + " " + cierreActual.empleado.apellidoEmpleado}</Typography>
              <Typography>Total: ${ventaData.totalVenta}</Typography>
              <Typography>Fecha: {new Date(ventaData.fechaDeVenta).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAnulacionVentaAbierto(false)}>Cancelar</Button>
          <Button onClick={anularVenta} variant="contained" color="error" disabled={!ventaData}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PanelCierre;