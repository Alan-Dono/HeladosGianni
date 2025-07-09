import apiClient from "../api/ApiCliente"; // Asegúrate de que la ruta sea correcta

// Función para obtener un cierre de caja por ID
export const getCierrePorId = async (id) => {
  try {
    const response = await apiClient.get(`/cierres/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el cierre de caja con ID: ${id}`, error);
    throw error;
  }
};

// Función para obtener un cierre de caja por ID
export const getCierreActivo = async () => {
  try {
    const response = await apiClient.get(`/cierres/activo`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el cierre activo`, error);
    throw error;
  }
};

// Función para obtener todos los cierres de caja por ID del turno
export const getCierresPorTurnoId = async (turnoId) => {
  try {
    const response = await apiClient.get(`/cierres/turno/${turnoId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener los cierres de caja para el turno con ID: ${turnoId}`,
      error
    );
    throw error;
  }
};

// Función para obtener todos los cierres de caja por ID del empleado
export const getCierresPorEmpleadoId = async (empleadoId) => {
  try {
    const response = await apiClient.get(`/cierres/empleado/${empleadoId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener los cierres de caja para el empleado con ID: ${empleadoId}`,
      error
    );
    throw error;
  }
};

// Función para iniciar una caja
export const iniciarCaja = async (iniciarCajaDtoReq) => {
  try {
    console.log("log de iniciar", iniciarCajaDtoReq);

    const response = await apiClient.post(
      "/cierres/iniciar",
      iniciarCajaDtoReq
    );
    return response.data;
  } catch (error) {
    console.error("Error al iniciar la caja", error);
    throw error;
  }
};

// Función para cambiar el responsable de la caja
export const cambiarResponsable = async (id, Dto) => {
  try {
    console.log("log cambio", id, Dto);

    const response = await apiClient.post(
      `/cierres/cambiarresponsable/${id}`,
      Dto
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al cambiar el responsable para la caja con ID: ${id}`,
      error
    );
    throw error;
  }
};

// Función para imprimir resumen del cierre
export const imprimirResumenCierre = async (id) => {
  try {
    const response = await apiClient.post(`/cierres/${id}/imprimir-resumen`);
    return response.data;
  } catch (error) {
    console.error(`Error al imprimir resumen del cierre con ID: ${id}`, error);
    throw error;
  }
};
