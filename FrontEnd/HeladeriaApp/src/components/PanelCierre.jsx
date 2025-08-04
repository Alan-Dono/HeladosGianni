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
  TextField,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import WarningIcon from '@mui/icons-material/Warning';
import CierreCajaService from '../services/CierreCajaService';
import EmpleadoService from '../services/EmpleadoService';
import TurnoService from '../services/TurnoService';
import VentaService from '../services/VentaService';
import { useTheme } from '@emotion/react';

// Componentes auxiliares
const EmpleadoSelect = ({ empleados, value, onChange, label = "Empleado" }) => (
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={onChange}>
      {empleados.map((emp) => (
        <MenuItem key={emp.id} value={emp.id}>
          {`${emp.nombreEmpleado} ${emp.apellidoEmpleado}`}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const CustomSnackbar = ({ open, message, severity, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <MuiAlert elevation={6} variant="filled" onClose={onClose} severity={severity}>
      {message}
    </MuiAlert>
  </Snackbar>
);

const ProductosList = ({ productos }) => (
  <ul>
    {productos.map((d, idx) => (
      <li key={idx}>
        {d.producto?.nombreProducto ?? "Sin nombre"} - {d.cantidad} x ${d.precioUnitario.toFixed(2)} = ${(d.cantidad * d.precioUnitario).toFixed(2)}
      </li>
    ))}
  </ul>
);

const PanelCierre = ({ onUpdate }) => {
  // Estados
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
  const [ventaEncontrada, setVentaEncontrada] = useState(null);
  const [empleadoDeLaVenta, setEmpleadoDeLaVenta] = useState(null);
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loadingVenta, setLoadingVenta] = useState(false);
  const theme = useTheme();


  // Efectos
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (turnoActual) {
      cargarCierreActual();
    }
  }, [turnoActual]);

  // Funciones de carga de datos
  const cargarDatosIniciales = async () => {
    await Promise.all([cargarEmpleados(), cargarTurnoActual()]);
  };

  const cargarEmpleados = async () => {
    try {
      const listaEmpleados = await EmpleadoService.obtenerEmpleados();
      setEmpleados(listaEmpleados);
    } catch (error) {
      mostrarError('Error al cargar empleados:', error);
    }
  };

  const cargarTurnoActual = async () => {
    try {
      const turno = await TurnoService.obtenerTurnoActivo();
      setTurnoActual(turno);
    } catch (error) {
      mostrarError('Error al cargar turno actual:', error);
    }
  };

  const cargarCierreActual = async () => {
    try {
      const cierreData = await CierreCajaService.obtenerActivo();
      setCierreActual(cierreData);
    } catch (error) {
      mostrarError("Error al cargar cierre actual", error);
    }
  };

  // Funciones de gestión de turno
  const iniciarTurno = async () => {
    if (!empleadoSeleccionado) return;

    try {
      await CierreCajaService.iniciar({ idEmpleado: empleadoSeleccionado });
      setModalAbierto(false);
      await cargarTurnoActual();
      await cargarCierreActual();
      onUpdate();
    } catch (error) {
      mostrarError('Error al iniciar turno:', error);
    }
  };

  const cambiarResponsable = async () => {
    if (!empleadoSeleccionado) return;

    try {
      await CierreCajaService.cambiarResponsable(
        cierreActual.id,
        { IdTurno: turnoActual.id, IdEmpleado: empleadoSeleccionado }
      );
      cargarCierreActual();
      setDialogoCambioAbierto(false);
      onUpdate();
    } catch (error) {
      mostrarError('Error al cambiar responsable:', error);
    }
  };

  const finalizarTurno = async () => {
    if (!turnoActual) return;

    try {
      await TurnoService.finalizar(turnoActual.id);
      setTurnoActual(null);
      setCierreActual(null);
      setDialogoFinalizarAbierto(false);
      onUpdate();
    } catch (error) {
      mostrarError('Error al finalizar turno:', error);
    }
  };

  // Funciones de gestión de ventas
  const cargarVenta = async () => {
    setLoadingVenta(true);
    setVentaEncontrada(null);
    setEmpleadoDeLaVenta(null); // Resetear el estado

    try {
      const venta = await VentaService.obtenerPorId(codigoVenta);

      if (!venta) {
        mostrarMensaje('No se encontró la venta', 'warning');
        setVentaEncontrada(false);
        return;
      }

      setVentaData(venta);
      setVentaEncontrada(true);

      // Obtener el cierre de caja y actualizar el estado del empleado
      const cierre = await CierreCajaService.obtenerPorId(venta.idCierreCaja);
      if (cierre && cierre.empleado) {
        setEmpleadoDeLaVenta({
          nombreEmpleado: cierre.empleado.nombreEmpleado,
          apellidoEmpleado: cierre.empleado.apellidoEmpleado
        });
      } else {
        mostrarMensaje('No se encontró información del empleado', 'warning');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        mostrarMensaje('Venta no encontrada', 'warning');
        setVentaEncontrada(false);
      } else {
        mostrarError('Error inesperado al cargar venta:', error);
      }
    } finally {
      setLoadingVenta(false);
    }
  };

  const anularVenta = async () => {
    try {
      await VentaService.anular(codigoVenta);
      mostrarMensaje('Venta anulada con éxito', 'success');
      limpiarEstadosVenta();
      setDialogoAnulacionVentaAbierto(false);
      onUpdate();
    } catch (error) {
      mostrarError("Error al anular venta:", error);
    }
  };

  // Funciones auxiliares
  const limpiarEstadosVenta = () => {
    setCodigoVenta('');
    setVentaData(null);
    setEmpleadoDeLaVenta(null);
    setVentaEncontrada(null);
  };

  const mostrarMensaje = (mensaje, severidad = 'success') => {
    setSnackbarInfo({ open: true, message: mensaje, severity: severidad });
  };

  const mostrarError = (mensaje, error) => {
    console.error(mensaje, error);
    mostrarMensaje(mensaje, 'error');
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizado
  return (
    <Box sx={{  }}>
      {/* Panel principal */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        //mb: 1,
        p: 2,
        backgroundColor: turnoActual ? theme.palette.background.paper : theme.palette.background.default,
      }}>
        {turnoActual && cierreActual ? (
          <>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main }}>
                Turno Activo #{turnoActual.id}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Inicio: {formatearFecha(cierreActual.fechaInicio)}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Responsable: {`${cierreActual.empleado.nombreEmpleado} ${cierreActual.empleado.apellidoEmpleado}`}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Ventas: <span style={{ color: theme.palette.success.main }}>{cierreActual.cantidadDeVentas}</span>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
  Descuento Total: <span style={{ color: theme.palette.warning.main }}>
    ${cierreActual.totalDescuentos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
  </span>
</Typography>

<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
  Total: <span style={{ color: theme.palette.primary.main }}>
    ${cierreActual.totalDeVentas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
  </span>
</Typography>

            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              '& .MuiButton-root': {
                minWidth: 180
              }
            }}>
              <Button
                variant="contained"
                onClick={() => setDialogoCambioAbierto(true)}
              >
                Cambiar Responsable
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setDialogoFinalizarAbierto(true)}
              >
                Finalizar Turno
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDialogoAnulacionVentaAbierto(true)}
              >
                Anular Venta
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            gap: 1
          }}>
            <Typography
              variant="h6"
              sx={{
                //mb: 1,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <WarningIcon color="warning" /> No hay turnos activos
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: '400px',
                //mb: 2
              }}
            >
              Para comenzar a registrar ventas, inicie un nuevo turno
            </Typography>
            <Button
              variant="contained"
              onClick={() => setModalAbierto(true)}
              size="large"
              sx={{
                px: 3,
                py: 1.5
              }}
            >
              Iniciar Nuevo Turno
            </Button>
          </Box>
        )}
      </Box>

      {/* Modal para iniciar turno */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350, // Aumenté el ancho para mejor legibilidad
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3, // Padding más equilibrado
          borderRadius: 1, // Bordes redondeados para mejor estética
          outline: 'none', // Elimina el outline en algunos navegadores
        }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 3, // Más espacio debajo del título
              textAlign: 'center', // Centrar el título
              fontWeight: 'bold', // Negrita para mejor jerarquía
            }}
          >
            Seleccionar Empleado
          </Typography>
          <EmpleadoSelect
            empleados={empleados}
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            sx={{ mb: 3 }} // Espacio debajo del select
          />
          <Button
            variant="contained"
            onClick={iniciarTurno}
            fullWidth
            sx={{ mt: 1 }} // Espacio mínimo arriba del botón
          >
            Iniciar Turno
          </Button>
        </Box>
      </Modal>

      {/* Diálogo para cambiar responsable */}
      <Dialog open={dialogoCambioAbierto} onClose={() => setDialogoCambioAbierto(false)}>
        <DialogTitle>Cambiar Responsable</DialogTitle>
        <DialogContent>
          <EmpleadoSelect
            empleados={empleados}
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            label="Nuevo Responsable"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoCambioAbierto(false)}>Cancelar</Button>
          <Button onClick={cambiarResponsable} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para finalizar turno */}
      <Dialog open={dialogoFinalizarAbierto} onClose={() => setDialogoFinalizarAbierto(false)}>
        <DialogTitle>Finalizar Turno</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea finalizar el turno actual?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoFinalizarAbierto(false)}>Cancelar</Button>
          <Button onClick={finalizarTurno} variant="contained" color="secondary">
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para anular venta */}
      <Dialog
        open={dialogoAnulacionVentaAbierto}
        onClose={() => {
          limpiarEstadosVenta();
          setDialogoAnulacionVentaAbierto(false);
        }}
      >
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
          <Button
            onClick={cargarVenta}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loadingVenta}
          >
            {loadingVenta ? 'Buscando...' : 'Buscar Venta'}
          </Button>

          {ventaData && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                Responsable: {empleadoDeLaVenta
                  ? `${empleadoDeLaVenta.nombreEmpleado} ${empleadoDeLaVenta.apellidoEmpleado}`
                  : 'Cargando...'}
              </Typography>
              <Typography>Total: ${ventaData.totalVenta}</Typography>
              <Typography>Fecha: {formatearFecha(ventaData.fechaDeVenta)}</Typography>
              {ventaData.detalleVenta?.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Productos:</Typography>
                  <ProductosList productos={ventaData.detalleVenta} />
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            limpiarEstadosVenta();
            setDialogoAnulacionVentaAbierto(false);
          }}>
            Cancelar
          </Button>
          <Button
            onClick={anularVenta}
            variant="contained"
            color="error"
            disabled={!ventaData}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <CustomSnackbar
        open={snackbarInfo.open}
        message={snackbarInfo.message}
        severity={snackbarInfo.severity}
        onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
      />
    </Box>
  );
};

export default PanelCierre;