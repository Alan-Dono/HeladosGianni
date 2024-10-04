import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import TurnoFormModal from '../components/TurnoFormModal';
import ResponsableFormModal from '../components/ResponsableFormModal';
import CierreParcialModal from '../components/CierreParcialModal';
import FinalizarTurnoModal from '../components/FinalizarTurnoModal';
import TurnoActualCard from '../components/TurnoActualCard';
import HistorialTurnosTable from '../components/HistorialTurnosTable';
import { getEmpleados } from '../api/ApiEmpleado';
export const Turnos = () => {
  const [empleados, setEmpleados] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [historialTurnos, setHistorialTurnos] = useState([]);
  const [openTurnoModal, setOpenTurnoModal] = useState(false);
  const [openResponsableModal, setOpenResponsableModal] = useState(false);
  const [openCierreParcialModal, setOpenCierreParcialModal] = useState(false);
  const [openFinalizarTurnoModal, setOpenFinalizarTurnoModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleIniciarTurno = (turnoData) => {
    setTurnoActual({ ...turnoData, ventas: [], responsableActual: turnoData.responsableInicial });
    setOpenTurnoModal(false);
    showSnackbar('Turno iniciado con éxito', 'success');
  };

  const handleCambiarResponsable = (nuevoResponsable) => {
    if (turnoActual) {
      const cierreParcial = {
        responsable: turnoActual.responsableActual,
        ventas: turnoActual.ventas,
        fecha: new Date()
      };
      setTurnoActual(prevTurno => ({
        ...prevTurno,
        responsableActual: nuevoResponsable,
        cierresParciales: [...(prevTurno.cierresParciales || []), cierreParcial],
        ventas: []
      }));
      setOpenResponsableModal(false);
      showSnackbar('Responsable cambiado con éxito', 'success');
    }
  };

  const handleCierreParcial = () => {
    if (turnoActual) {
      const cierreParcial = {
        responsable: turnoActual.responsableActual,
        ventas: turnoActual.ventas,
        fecha: new Date()
      };
      setTurnoActual(prevTurno => ({
        ...prevTurno,
        cierresParciales: [...(prevTurno.cierresParciales || []), cierreParcial],
        ventas: []
      }));
      setOpenCierreParcialModal(false);
      showSnackbar('Cierre parcial realizado con éxito', 'success');
    }
  };

  const handleFinalizarTurno = () => {
    if (turnoActual) {
      const turnoFinalizado = {
        ...turnoActual,
        fechaFin: new Date(),
        cierresParciales: [
          ...(turnoActual.cierresParciales || []),
          {
            responsable: turnoActual.responsableActual,
            ventas: turnoActual.ventas,
            fecha: new Date()
          }
        ]
      };
      setHistorialTurnos(prevHistorial => [...prevHistorial, turnoFinalizado]);
      setTurnoActual(null);
      setOpenFinalizarTurnoModal(false);
      showSnackbar('Turno finalizado con éxito', 'success');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchEmpleados = useCallback(async () => {
    try {
      const empleadosData = await getEmpleados();
      setEmpleados(empleadosData);
    } catch (error) {
      console.error("Error al obtener empleados", error);
      showSnackbar('Error al cargar los empleados', 'error');
    }
  }, []);

  useEffect(() => {
    fetchEmpleados();
  },[])


  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Gestión de Turnos</Typography>

      {!turnoActual ? (
        <Button variant="contained" onClick={() => setOpenTurnoModal(true)}>Iniciar Turno</Button>
      ) : (
        <>
          <TurnoActualCard
            turno={turnoActual}
            onCambiarResponsable={() => setOpenResponsableModal(true)}
            onCierreParcial={() => setOpenCierreParcialModal(true)}
            onFinalizarTurno={() => setOpenFinalizarTurnoModal(true)}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setOpenResponsableModal(true)}>Cambiar Responsable</Button>
            <Button variant="contained" onClick={() => setOpenCierreParcialModal(true)} sx={{ ml: 2 }}>Cierre Parcial</Button>
            <Button variant="contained" color="secondary" onClick={() => setOpenFinalizarTurnoModal(true)} sx={{ ml: 2 }}>Finalizar Turno</Button>
          </Box>
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Historial de Turnos</Typography>
        <HistorialTurnosTable turnos={historialTurnos} />
      </Box>

      <TurnoFormModal
        open={openTurnoModal}
        onClose={() => setOpenTurnoModal(false)}
        onIniciarTurno={handleIniciarTurno}
      />
      <ResponsableFormModal
        open={openResponsableModal}
        onClose={() => setOpenResponsableModal(false)}
        onCambiarResponsable={handleCambiarResponsable}
      />
      <CierreParcialModal
        open={openCierreParcialModal}
        onClose={() => setOpenCierreParcialModal(false)}
        onCierreParcial={handleCierreParcial}
        turnoActual={turnoActual}
      />
      <FinalizarTurnoModal
        open={openFinalizarTurnoModal}
        onClose={() => setOpenFinalizarTurnoModal(false)}
        onFinalizarTurno={handleFinalizarTurno}
        turnoActual={turnoActual}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};