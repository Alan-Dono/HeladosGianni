// src/services/TurnoService.js

import {
  iniciarTurno,
  finalizarTurno,
  obtenerTurnoPorId,
  obtenerTodosLosTurnos,
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

  async finalizar(id, fechaFin) {
    try {
      await finalizarTurno(id, fechaFin);
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

  async obtenerTodos() {
    try {
      const turnos = await obtenerTodosLosTurnos();
      return turnos;
    } catch (error) {
      console.error("Error al obtener todos los turnos", error);
      throw error;
    }
  }
}

const turnoService = new TurnoService();

export default turnoService;
