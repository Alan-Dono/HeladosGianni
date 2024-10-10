import apiClient from "../api/ApiCliente"; // Asegúrate de que la ruta sea correcta
import {crearVenta} from "../api/ApiVentas"; // Asegúrate de tener esta función
import {imprimirTicket} from "../utils/Impresora"; // Función hipotética para imprimir tickets

const VentaService = {
  // Función para crear una nueva venta
  crearVenta: async (ventaData, empleadoId) => {
    try {
      // Agregar el empleado actual a la venta
      const ventaConEmpleado = {
        ...ventaData,
        EmpleadoId: empleadoId,
      };

      // Llamar a la API para guardar la venta en la base de datos
      const response = await apiClient.post("/ventas", ventaConEmpleado);
      const ventaCreada = response.data;

      // Registrar la venta en el turno
      await registrarVentaEnTurno(ventaCreada.id, empleadoId);

      // Imprimir el ticket
      imprimirTicket(ventaCreada);

      return ventaCreada; // Retorna la venta creada
    } catch (error) {
      console.error("Error al crear la venta", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },
};

export default VentaService;
