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
    console.log("repuestaAPi", response.data);

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
      FechaDeVenta: venta.fechaDeVenta,
      TotalVenta: venta.totalVenta,
      Descuentos: venta.Descuentos || 0,
      IdCierreCaja: venta.IdCierreCaja,
      detallesVentas: venta.detallesVentas.map((detalle) => ({
        ProductoId: detalle.productoId,
        Cantidad: detalle.cantidad,
        PrecioUnitario: detalle.precioUnitario,
      })),
    };
    console.log("log api/", ventaObj);

    const response = await apiClient.post("/ventas", ventaObj);
    return response.data;
  } catch (error) {
    console.error("Error al crear la venta", error);
    throw error;
  }
};

// Función para eliminar una venta (anular)
export const anularVenta = async (id) => {
  try {
    const response = await apiClient.put(`/ventas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al anular la venta con ID: ${id}`, error);
    throw error;
  }
};

// Función para obtener ventas por ID de cierre de caja
export const getVentasPorCierreCaja = async (id) => {
  try {
    const response = await apiClient.get(`/ventas/cierres/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener las ventas para el cierre de caja en API con ID: ${id}`,
      error
    );
    throw error;
  }
};
