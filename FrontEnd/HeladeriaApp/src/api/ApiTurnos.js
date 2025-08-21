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

{
  /*
// Función para obtener todos los turnos
export const obtenerTodosLosTurnos = async () => {
  try {
    const response = await apiClient.get("/turnos");
    return response.data;
  } catch (error) {
    console.error("El servidor no responde", error);
    throw error;
  }
};
 */
}
// Función para obtener turnos activo
export const obtenerTurnoActivo = async () => {
  try {
    const response = await apiClient.get("/turnos/activo");
    return response.data;
  } catch (error) {
    console.error("El servidor no responde", error);
    throw error;
  }
};

{
  /* 
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
*/
}

// Función para eliminar un turno
export const eliminarTurno = async (id) => {
  try {
    await apiClient.delete(`/turnos/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el turno con ID: ${id}`, error);
    throw error;
  }
};

// Función para imprimir resumen del turno
export const imprimirResumenTurno = async (id) => {
  try {
    const response = await apiClient.post(`/turnos/${id}/imprimir-resumen`);
    return response.data;
  } catch (error) {
    console.error(`Error al imprimir resumen del turno con ID: ${id}`, error);
    throw error;
  }
};

export const obtenerTodosLosTurnos = async (pageNumber = 1, pageSize = 25) => {
  const response = await apiClient.get("/turnos", {
    params: {pageNumber, pageSize},
  });
  console.log("pageNumber: ", pageNumber, " y pageSize: ", pageSize);

  console.log("Turnos: ", response.data);

  return response.data; // { data, totalCount }
};

export const obtenerTurnosPorFechas = async (
  fechaDesde,
  fechaHasta,
  pageNumber = 1,
  pageSize = 25
) => {
  const response = await apiClient.get("/turnos/fechas", {
    params: {fechaDesde, fechaHasta, pageNumber, pageSize},
  });
  return response.data; // { data, totalCount }
};
