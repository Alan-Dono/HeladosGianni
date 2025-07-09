import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';
import PanelCierre from '../components/PanelCierre';
import TablaTurnos from '../components/TablaTurnos';
import TurnoService from '../services/TurnoService';

export const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [actualizarTurnos, setActualizarTurnos] = useState(false);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    cargarTurnos();
  }, [actualizarTurnos]);

  const cargarTurnos = async () => {
    try {
      const listaTurnos = await TurnoService.obtenerTodos();
      setTurnos(listaTurnos);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const buscarPorFechas = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Seleccioná ambas fechas');
      return;
    }

    try {
      const listaFiltrada = await TurnoService.buscarPorFechas(fechaDesde, fechaHasta);
      setTurnos(listaFiltrada);
    } catch (error) {
      console.error('Error al buscar turnos por fechas:', error);
    }
  };

  const actualizarVista = () => {
    setActualizarTurnos(prev => !prev);
  };

  return (
    <Box sx={{ p: 1 }}>
      <PanelCierre onUpdate={actualizarVista} />
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          label="Desde"
          type="date"
          size="small"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Hasta"
          type="date"
          size="small"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={buscarPorFechas}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={cargarTurnos}
        >
          Limpiar
        </Button>
      </Stack>


      <TablaTurnos turnos={turnos} onUpdate={actualizarVista} />
    </Box>
  );
};

export default Turnos;
