import apiClient from "../api/ApiCliente"; // Asegúrate de que la ruta sea correcta

// Función para iniciar un turno
export const iniciarTurno = async (turnoDtoReq) => {
  try {
    const obj = {
      EmpleadoId: turnoDtoReq.responsableInicial,
      FechaInicio: turnoDtoReq.fechaInicio,
    };
    const response = await apiClient.post("/turnos/iniciar", obj);
    console.log("log de api", obj);

    return response.data;
  } catch (error) {
    console.error("Error al iniciar el turno", error);
    throw error;
  }
};

// Función para finalizar un turno
export const finalizarTurno = async (id) => {
  try {
    const response = await apiClient.post(`/turnos/finalizar/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al finalizar el turno con ID: ${id}`, error);
    throw error;
  }
};

// Función para obtener un turno por ID
export const obtenerTurnoPorId = async (id) => {
  try {
    const response = await apiClient.get(`/turnos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el turno con ID: ${id}`, error);
    throw error;
  }
};

// Función para obtener todos los turnos
export const obtenerTodosLosTurnos = async () => {
  try {
    const response = await apiClient.get("/turnos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los turnos", error);
    throw error;
  }
};

// Función para obtener turnos activo
export const obtenerTurnoActivo = async () => {
  try {
    const response = await apiClient.get("/turnos/activo");
    return response.data;
  } catch (error) {
    console.error("Error al obtener el turno activo", error);
    throw error;
  }
};

// Función para obtener turnos por fechas
export const obtenerTurnosPorFechas = async (fechaDesde, fechaHasta) => {
  try {
    const response = await apiClient.get("/turnos/fechas", {
      params: {fechaDesde, fechaHasta},
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener turnos por fechas", error);
    throw error;
  }
};

// Función para eliminar un turno
export const eliminarTurno = async (id) => {
  try {
    await apiClient.delete(`/turnos/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el turno con ID: ${id}`, error);
    throw error;
  }
};
