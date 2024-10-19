import {
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getEmpleadoById,
  getEmpleados,
} from "../api/ApiEmpleado"; // Asegúrate de que la ruta sea correcta

const EmpleadoService = {
  // Función para obtener todos los empleados
  obtenerEmpleados: async () => {
    try {
      const empleados = await getEmpleados();
      return empleados; // Retorna la lista de empleados
    } catch (error) {
      console.error("Error al obtener los empleados", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener un empleado por ID
  obtenerEmpleadoPorId: async (id) => {
    try {
      const empleado = await getEmpleadoById(id);
      return empleado; // Retorna el empleado encontrado
    } catch (error) {
      console.error(`Error al obtener el empleado con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para crear un nuevo empleado
  registrarEmpleado: async (empleadoData) => {
    try {
      const nuevoEmpleado = await createEmpleado(empleadoData);
      return nuevoEmpleado; // Retorna el empleado creado
    } catch (error) {
      console.error("Error al crear el empleado", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para actualizar un empleado existente
  editarEmpleado: async (id, empleadoData) => {
    try {
      const empleadoActualizado = await updateEmpleado(id, empleadoData);
      return empleadoActualizado; // Retorna el empleado actualizado
    } catch (error) {
      console.error(`Error al actualizar el empleado con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para eliminar un empleado por ID
  eliminarEmpleado: async (id) => {
    try {
      const respuesta = await deleteEmpleado(id);
      return respuesta; // Retorna la respuesta de la eliminación
    } catch (error) {
      console.error(`Error al eliminar el empleado con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },
};

export default EmpleadoService;
