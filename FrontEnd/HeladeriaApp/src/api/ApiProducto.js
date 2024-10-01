import apiClient from "../api/ApiCliente"; // Asegúrate de que la ruta sea correcta

// Función para obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await apiClient.get("/productos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos", error);
    throw error;
  }
};

// Función para obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await apiClient.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID: ${id}`, error);
    throw error;
  }
};

// Función para crear un nuevo producto
export const crearProducto = async (producto) => {
  try {
    // Verifica el objeto antes de enviarlo
    const productoObj = {
      Descripcion: producto.descripcion,
      NombreProducto: producto.nombre,
      Precio: producto.precio,
      ProductoCategoriaId: producto.categoria,
    };
    const response = await apiClient.post("/productos", productoObj);
    return response.data;
  } catch (error) {
    console.error("Error al crear el producto", error);
    throw error;
  }
};

// Función para actualizar un producto existente
export const actualizarProducto = async (id, producto) => {
  try {
    // Verifica el objeto antes de enviarlo
    const productoActualizado = {
      ProductoCategoriaId: producto.categoria,
      Descripcion: producto.descripcion,
      NombreProducto: producto.nombre,
      Precio: producto.precio,
    };
    const response = await apiClient.put(
      `/productos/${id}`,
      productoActualizado
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al actualizar el producto con ID: ${id}`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Función para eliminar un producto por ID
export const eliminarProducto = async (id) => {
  try {
    const response = await apiClient.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el producto con ID: ${id}`, error);
    throw error;
  }
};

// Función para obtener productos por categoría
export const getProductoByCategory = async (id) => {
  try {
    const response = await apiClient.get(`/productos/categoria/${id}`);
    console.log("log", response.data);

    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID: ${id}`, error);
    throw error;
  }
};
