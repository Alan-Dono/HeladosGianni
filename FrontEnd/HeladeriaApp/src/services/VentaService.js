import {imprimirTicket} from "../utils/Impresora"; // Función hipotética para imprimir tickets
import {
  crearVenta,
  anularVenta,
  getVentaById,
  getVentasPorCierreCaja,
  crearVentaFiscal,
} from "../api/ApiVentas";

const VentaService = {
  // Función para crear una nueva venta
  registrarVenta: async (ventaData) => {
    try {
      // Llamar a la API para guardar la venta en la base de datos
      const response = await crearVenta(ventaData);
      const ventaCreada = response;

      // Imprimir el ticket
      imprimirTicket(ventaCreada);

      return ventaCreada; // Retorna la venta creada
    } catch (error) {
      console.error("Error al crear la venta", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  registrarVentaFiscal: async (ventaData) => {
    try {
      // Llamar a la API para guardar la venta en la base de datos
      const response = await crearVentaFiscal(ventaData);
      const ventaCreada = response;

      // Imprimir el ticket
      imprimirTicket(ventaCreada);

      return ventaCreada; // Retorna la venta creada
    } catch (error) {
      console.error("Error al crear la venta", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para anular una venta
  anular: async (id) => {
    try {
      const response = await anularVenta(id);
      return response; // Retorna la respuesta de la anulación
    } catch (error) {
      console.error(`Error al anular la venta con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener una venta por ID
  obtenerPorId: async (id) => {
    try {
      const response = await getVentaById(id);
      return response; // Retorna la venta obtenida
    } catch (error) {
      console.error(`Error al obtener la venta con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener ventas por ID de cierre de caja
  obtenerPorCierreCaja: async (id) => {
    try {
      const response = await getVentasPorCierreCaja(id);
      return response; // Retorna las ventas obtenidas
    } catch (error) {
      console.error(
        `Error al obtener las ventas para el cierre de caja con ID: ${id}`,
        error
      );
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },
};

export default VentaService;
