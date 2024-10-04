import apiClient from "../api/ApiCliente"; // Asegúrate de que la ruta sea correcta

export const getProductosCategorias = async () => {
  try {
    const response = await apiClient.get("/producto/categoria");

    // Definir un orden específico para las categorías
    const ordenCategorias = {
      Heladeria: 1,
      Cafeteria: 2,
      Chocolateria: 3,
      // Agrega más categorías si es necesario
    };

    // Ordenar las categorías según el objeto ordenCategorias
    const categoriasOrdenadas = response.data.sort((a, b) => {
      return (
        (ordenCategorias[a.nombreCategoria] || Infinity) -
        (ordenCategorias[b.nombreCategoria] || Infinity)
      );
    });
    
    return categoriasOrdenadas;
  } catch (error) {
    console.error("Error al obtener los productos", error);
    throw error;
  }
};
