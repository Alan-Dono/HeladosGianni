import apiClient from "../api/ApiCliente"; // Asegúrate de que la ruta sea correcta

export const getProductosCategorias = async () => {
  try {
    const response = await apiClient.get("/producto/categoria");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos", error);
    throw error;
  }
};
