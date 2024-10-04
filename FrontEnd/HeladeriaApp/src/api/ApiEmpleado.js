import apiClient from "./ApiCliente";

// Función para crear un nuevo empleado
export const createEmpleado = async (empleadoData) => {
  console.log("log dataApi", empleadoData);
  try {
    const obj = {
      NombreEmpleado: empleadoData.nombreEmpleado, // Ajustar aquí
      ApellidoEmpleado: empleadoData.apellidoEmpleado, // Ajustar aquí
      Celular: empleadoData.celular,
      FechaContratacion: empleadoData.fechaContratacion
        ? new Date(empleadoData.fechaContratacion).toISOString().split("T")[0] // yyyy-MM-dd
        : null,
    };

    console.log("log de la llamada api", obj);
    const response = await apiClient.post("/empleados", obj);
    return response.data;
  } catch (error) {
    console.error("Error al crear el empleado", error);
    throw error;
  }
};

// Función para actualizar un empleado existente
export const updateEmpleado = async (id, empleadoData) => {
  try {
    const obj = {
      NombreEmpleado: empleadoData.nombreEmpleado, // Ajustar aquí
      ApellidoEmpleado: empleadoData.apellidoEmpleado, // Ajustar aquí
      Celular: empleadoData.celular,
      FechaContratacion: empleadoData.fechaContratacion
        ? new Date(empleadoData.fechaContratacion).toISOString().split("T")[0] // yyyy-MM-dd
        : null,
    };
    const response = await apiClient.put(`/empleados/${id}`, obj);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el empleado con ID ${id}`, error);
    throw error;
  }
};

// Función para eliminar un empleado
export const deleteEmpleado = async (id) => {
  try {
    const response = await apiClient.delete(`/empleados/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el empleado con ID ${id}`, error);
    throw error;
  }
};

// Función para obtener un empleado por su ID
export const getEmpleadoById = async (id) => {
  try {
    const response = await apiClient.get(`/empleados/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el empleado con ID ${id}`, error);
    throw error;
  }
};

// Función para obtener todos los empleados
export const getEmpleados = async () => {
  try {
    const response = await apiClient.get("/empleados");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los empleados", error);
    throw error;
  }
};
