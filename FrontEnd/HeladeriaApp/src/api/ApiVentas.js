import apiClient from "../api/ApiCliente"; // Asegúrate de que la ruta sea correcta

// Función para obtener todas las ventas
export const getVentas = async () => {
  try {
    const response = await apiClient.get("/ventas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las ventas", error);
    throw error;
  }
};

// Función para obtener una venta por ID
export const getVentaById = async (id) => {
  try {
    const response = await apiClient.get(`/ventas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la venta con ID: ${id}`, error);
    throw error;
  }
};

// Función para obtener ventas entre fechas
export const getVentasEntreFechas = async (desde, hasta) => {
  try {
    const response = await apiClient.get("/ventas/entre-fechas", {
      params: {desde, hasta},
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener las ventas entre ${desde} y ${hasta}`,
      error
    );
    throw error;
  }
};

// Función para crear una nueva venta
export const crearVenta = async (venta) => {
  try {
    const ventaObj = {
      EmpleadoId: venta.empleadoId,
      FechaDeVenta: venta.fechaDeVenta,
      TotalVenta: venta.totalVenta,
      DetallesVentas: venta.detallesVentas.map((detalle) => ({
        ProductoId: detalle.productoId,
        Cantidad: detalle.cantidad,
        PrecioUnitario: detalle.precioUnitario,
        Subtotal: detalle.subtotal,
      })),
    };
    const response = await apiClient.post("/ventas", ventaObj);
    return response.data;
  } catch (error) {
    console.error("Error al crear la venta", error);
    throw error;
  }
};

// Función para eliminar una venta por ID
export const eliminarVenta = async (id) => {
  try {
    const response = await apiClient.delete(`/ventas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la venta con ID: ${id}`, error);
    throw error;
  }
};

// Función para obtener ventas por ID de turno
export const getVentasPorTurno = async (id) => {
  try {
    const response = await apiClient.get(`/ventas/obtenerportuno${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener las ventas para el turno con ID: ${id}`,
      error
    );
    throw error;
  }
};
