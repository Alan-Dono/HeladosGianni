import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PanelCierre from '../components/PanelCierre';
import TablaTurnos from '../components/TablaTurnos';
import TurnoService from '../services/TurnoService';

export const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [actualizarTurnos, setActualizarTurnos] = useState(false);

  useEffect(() => {
    cargarTurnos();
  }, [actualizarTurnos]);

  const cargarTurnos = async () => {
    try {
      const listaTurnos = await TurnoService.obtenerTodos();
      console.log('turnos', listaTurnos);

      setTurnos(listaTurnos);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const actualizarVista = () => {
    setActualizarTurnos(prev => !prev);
  };

  return (
    <Box sx={{ p: 1 }}>
      <PanelCierre onUpdate={actualizarVista} />
      <TablaTurnos turnos={turnos} onUpdate={actualizarVista} />
    </Box>
  );
};

export default Turnos;