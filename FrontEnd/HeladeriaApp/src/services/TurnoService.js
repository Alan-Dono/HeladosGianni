// src/services/TurnoService.js

import {
  iniciarTurno,
  finalizarTurno,
  obtenerTurnoPorId,
  obtenerTodosLosTurnos,
  obtenerTurnoActivo,
  obtenerTurnosPorFechas,
  imprimirResumenTurno,
} from "../api/ApiTurnos";

class TurnoService {
  async iniciar(turnoDtoReq) {
    try {
      const nuevoTurno = await iniciarTurno(turnoDtoReq);
      console.log("log de servicio", turnoDtoReq);

      return nuevoTurno;
    } catch (error) {
      console.error("Error al iniciar el turno", error);
      throw error;
    }
  }

  async finalizar(id) {
    try {
      await finalizarTurno(id);
      console.log(`Turno con ID: ${id} finalizado con éxito.`);
    } catch (error) {
      console.error(`Error al finalizar el turno con ID: ${id}`, error);
      throw error;
    }
  }

  async obtenerPorId(id) {
    try {
      const turno = await obtenerTurnoPorId(id);
      return turno;
    } catch (error) {
      console.error(`Error al obtener el turno con ID: ${id}`, error);
      throw error;
    }
  }

  async obtenerTodos(pageNumber = 1, pageSize = 25) {
    return await obtenerTodosLosTurnos(pageNumber, pageSize);
  }

  async obtenerTurnoActivo() {
    try {
      const turnos = await obtenerTurnoActivo();
      return turnos;
    } catch (error) {
      console.error("Error al obtener todos los turnos", error);
      throw error;
    }
  }

  async buscarPorFechas(fechaDesde, fechaHasta, pageNumber = 1, pageSize = 25) {
    return await obtenerTurnosPorFechas(
      fechaDesde,
      fechaHasta,
      pageNumber,
      pageSize
    );
  }

  async imprimirResumen(id) {
    try {
      const resultado = await imprimirResumenTurno(id);
      console.log(`Resumen del turno con ID: ${id} enviado a impresión.`);
      return resultado;
    } catch (error) {
      console.error(`Error al imprimir resumen del turno con ID: ${id}`, error);
      throw error;
    }
  }
}

const turnoService = new TurnoService();

export default turnoService;
