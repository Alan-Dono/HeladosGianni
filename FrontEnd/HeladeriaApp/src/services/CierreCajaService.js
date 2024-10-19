import {
  getCierrePorId,
  getCierresPorTurnoId,
  getCierresPorEmpleadoId,
  iniciarCaja,
  cambiarResponsable,
  getCierreActivo,
} from "../api/ApiCierres";

const CierreCajaService = {
  // Función para obtener un cierre de caja por ID
  obtenerPorId: async (id) => {
    try {
      const cierre = await getCierrePorId(id);
      return cierre; // Retorna el cierre de caja encontrado
    } catch (error) {
      console.error(`Error al obtener el cierre de caja con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener un cierre de caja por ID
  obtenerActivo: async () => {
    try {
      const cierre = await getCierreActivo();
      return cierre; // Retorna el cierre de caja encontrado
    } catch (error) {
      console.error(`Error al obtener el cierre activo`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener todos los cierres de caja por ID del turno
  obtenerPorTurnoId: async (turnoId) => {
    try {
      const cierres = await getCierresPorTurnoId(turnoId);
      return cierres; // Retorna la lista de cierres de caja para el turno
    } catch (error) {
      console.error(
        `Error al obtener los cierres de caja para el turno con ID: ${turnoId}`,
        error
      );
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener todos los cierres de caja por ID del empleado
  obtenerPorEmpleadoId: async (empleadoId) => {
    try {
      const cierres = await getCierresPorEmpleadoId(empleadoId);
      return cierres; // Retorna la lista de cierres de caja para el empleado
    } catch (error) {
      console.error(
        `Error al obtener los cierres de caja para el empleado con ID: ${empleadoId}`,
        error
      );
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para iniciar una caja
  iniciar: async (iniciarCajaDtoReq) => {
    try {
      const nuevoCierre = await iniciarCaja(iniciarCajaDtoReq);
      return nuevoCierre; // Retorna el cierre de caja iniciado
    } catch (error) {
      console.error("Error al iniciar la caja", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para cambiar el responsable de la caja
  cambiarResponsable: async (id, Dto) => {
    try {
      console.log("fetch", id, Dto);

      const respuesta = await cambiarResponsable(id, Dto);
      return respuesta; // Retorna la respuesta del cambio de responsable
    } catch (error) {
      console.error(
        `Error al cambiar el responsable para la caja con ID: ${id}`,
        error
      );
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },
};

export default CierreCajaService;
