import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Fade,
  Typography
} from '@mui/material';
import PanelCierre from '../components/PanelCierre';
import TablaTurnos from '../components/TablaTurnos';
import TurnoService from '../services/TurnoService';

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  // Función principal para cargar turnos
  const fetchTurnos = async (model = paginationModel, resetPagination = false, customFechas = null) => {
    setCargando(true);
    try {
      // Si resetPagination es true, usar página 0, sino usar la del modelo
      const currentModel = resetPagination ? { ...model, page: 0 } : model;
      const page = currentModel.page + 1; // DataGrid usa base 0, backend base 1
      const size = currentModel.pageSize;

      // Usar fechas personalizadas si se pasan, sino usar las del estado
      const fechasAUsar = customFechas !== null ? customFechas : { desde: fechaDesde, hasta: fechaHasta };

      let result;
      if (fechasAUsar.desde && fechasAUsar.hasta) {
        const fhAjustada = new Date(fechasAUsar.hasta);
        fhAjustada.setHours(23, 59, 59, 999);
        result = await TurnoService.buscarPorFechas(fechasAUsar.desde, fhAjustada, page, size);
      } else {
        result = await TurnoService.obtenerTodos(page, size);
      }

      setTurnos(result.data ?? []);
      setRowCount(result.totalCount ?? 0);

      // Si reseteamos la paginación, actualizar el estado
      if (resetPagination) {
        setPaginationModel(currentModel);
      }
    } catch (e) {
      console.error('Error al cargar turnos:', e);
      setTurnos([]);
      setRowCount(0);
    } finally {
      setCargando(false);
      setMostrarContenido(true);
    }
  };

  // Buscar por fechas
  const buscarPorFechas = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Selecciona ambas fechas');
      return;
    }

    // Resetear a la primera página al hacer búsqueda
    await fetchTurnos(paginationModel, true, { desde: fechaDesde, hasta: fechaHasta });
  };

  // Limpiar búsqueda
  const limpiarBusqueda = async () => {
    // Primero hacer la consulta con fechas vacías
    await fetchTurnos(paginationModel, true, { desde: '', hasta: '' });

    // Luego limpiar el estado (esto es solo para el UI)
    setFechaDesde('');
    setFechaHasta('');
  };

  // Función para actualizar desde PanelCierre
  const actualizarVista = async () => {
    // Mantener la página actual al actualizar
    await fetchTurnos(paginationModel, false, null);
  };

  // Carga inicial
  useEffect(() => {
    fetchTurnos();
  }, []);

  // Manejar cambios de paginación
  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    fetchTurnos(model, false, null);
  };

  return (
    <Box sx={{
      p: 1,
      position: 'relative',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}>
      {/* Spinner */}
      <Fade
        in={cargando}
        timeout={{ enter: 100, exit: 400 }}
        unmountOnExit
        style={{ transitionDelay: cargando ? '200ms' : '0ms' }}
      >
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 9999
        }}>
          <CircularProgress size={80} color="primary" thickness={4} />
        </Box>
      </Fade>

      {/* Contenido principal */}
      <Fade in={mostrarContenido} timeout={500}>
        <Box sx={{
          flex: 1,
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          opacity: mostrarContenido ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: cargando ? 'none' : 'auto'
        }}>
          {/* PanelCierre */}
          <Box sx={{ p: 1 }}>
            <PanelCierre onUpdate={actualizarVista} />
          </Box>

          {/* Controles de búsqueda */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              alignItems: 'center',
              gap: 1
            }}
          >
            <TextField
              label="Desde"
              type="date"
              size="small"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  '& input::-webkit-calendar-picker-indicator': {
                    filter: 'invert(0.4)',
                    opacity: 0.8,
                    transform: 'scale(1.3)',
                    marginRight: '4px'
                  }
                }
              }}
              sx={{ width: 180 }}
            />
            <TextField
              label="Hasta"
              type="date"
              size="small"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  '& input::-webkit-calendar-picker-indicator': {
                    filter: 'invert(0.4)',
                    opacity: 0.8,
                    transform: 'scale(1.3)',
                    marginRight: '4px'
                  }
                }
              }}
              sx={{ width: 180 }}
            />
            <Button
              variant="contained"
              onClick={buscarPorFechas}
              sx={{ textTransform: 'none' }}
              disabled={cargando}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={limpiarBusqueda}
              sx={{ textTransform: 'none' }}
              disabled={cargando}
            >
              Limpiar
            </Button>

            {/* Indicador visual de filtros activos */}
            {fechaDesde && fechaHasta && (
              <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
                📅 Filtrado: {fechaDesde} a {fechaHasta}
              </Typography>
            )}
          </Stack>

          {/* Contenedor de la tabla */}
          <Box sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}>
            {turnos.length === 0 && !cargando ? (
              <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Typography variant="h6" color="text.secondary">
                  {fechaDesde && fechaHasta
                    ? `No se encontraron turnos entre ${fechaDesde} y ${fechaHasta}`
                    : 'No se encontraron turnos'
                  }
                </Typography>
              </Box>
            ) : (
              <Box sx={{
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
                p: 0.5
              }}>
                <TablaTurnos
                  turnos={turnos}
                  rowCount={rowCount}
                  paginationModel={paginationModel}
                  onPaginationModelChange={handlePaginationChange}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Turnos;