import React, { useState, useEffect, useRef } from 'react';
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


  const cargarTurnos = async (filtros = {}) => {
    try {
      // Solo muestra spinner si es la carga inicial o si la operación podría demorar
      if (filtros.conFechas || turnos.length === 0) {
        setCargando(true);
      }

      let listaTurnos;
      if (filtros.conFechas) {
        const fechaHastaAjustada = new Date(filtros.fechaHasta);
        fechaHastaAjustada.setHours(23, 59, 59, 999);
        listaTurnos = await TurnoService.buscarPorFechas(
          new Date(filtros.fechaDesde),
          fechaHastaAjustada
        );
      } else {
        listaTurnos = await TurnoService.obtenerTodos();
      }

      setTurnos(listaTurnos || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
      setMostrarContenido(true); // Siempre muestra el contenido después de cargar
    }
  };

  const buscarPorFechas = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Seleccioná ambas fechas');
      return;
    }
    await cargarTurnos({ conFechas: true, fechaDesde, fechaHasta });
  };

  const limpiarBusqueda = async () => {
    setFechaDesde('');
    setFechaHasta('');
    await cargarTurnos(); // No fuerza spinner a menos que sea primera carga
  };


  useEffect(() => {
    cargarTurnos();
  }, []);

  const actualizarVista = () => {
    if (fechaDesde && fechaHasta) {
      buscarPorFechas();
    } else {
      cargarTurnos();
    }
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
      {/*<Fade in={cargando} timeout={{ enter: 100, exit: 400 }} unmountOnExit>*/}
      <Fade
        in={cargando}
        timeout={{ enter: 100, exit: 400 }}
        unmountOnExit
        style={{ transitionDelay: cargando ? '200ms' : '0ms' }} // Retraso para evitar parpadeo
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
          pointerEvents: cargando ? 'none' : 'auto' // Deshabilita interacciones durante carga
        }}>
          {/* PanelCierre con menos margen */}
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
              sx={{ width: 180 }}
            />
            <TextField
              label="Hasta"
              type="date"
              size="small"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 180 }}
            />
            <Button
              variant="contained"
              onClick={buscarPorFechas}
              sx={{ textTransform: 'none' }}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={limpiarBusqueda}
              sx={{ textTransform: 'none' }}
            >
              Limpiar
            </Button>
          </Stack>

          {/* Contenedor de la tabla optimizado */}
          <Box sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}>
            {turnos.length === 0 ? (
              <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Typography variant="h6" color="text.secondary">
                  No se encontraron turnos
                </Typography>
              </Box>
            ) : (
              <Box sx={{
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
                p: 0.5
              }}>
                <TablaTurnos turnos={turnos} onUpdate={actualizarVista} />
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Turnos;