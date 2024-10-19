import {
  crearProducto,
  eliminarProducto,
  getProductoById,
  getProductos,
  actualizarProducto,
  getProductoByCategory,
} from "../api/ApiProducto"; // Asegúrate de que la ruta sea correcta

const ProductoService = {
  // Función para obtener todos los productos
  obtenerProductos: async () => {
    try {
      const productos = await getProductos();
      console.log("log productos", productos);
      return productos; // Retorna la lista de productos
    } catch (error) {
      console.error("Error al obtener los productos", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener un producto por ID
  obtenerProductoPorId: async (id) => {
    try {
      const producto = await getProductoById(id);
      return producto; // Retorna el producto encontrado
    } catch (error) {
      console.error(`Error al obtener el producto con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para crear un nuevo producto
  registrarProducto: async (producto) => {
    try {
      const nuevoProducto = await crearProducto(producto);
      return nuevoProducto; // Retorna el producto creado
    } catch (error) {
      console.error("Error al crear el producto", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para actualizar un producto existente
  editarProducto: async (id, producto) => {
    try {
      const productoActualizado = await actualizarProducto(id, producto);
      return productoActualizado; // Retorna el producto actualizado
    } catch (error) {
      console.error(`Error al actualizar el producto con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para eliminar un producto por ID
  eliminar: async (id) => {
    try {
      const respuesta = await eliminarProducto(id);
      return respuesta; // Retorna la respuesta de la eliminación
    } catch (error) {
      console.error(`Error al eliminar el producto con ID: ${id}`, error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },

  // Función para obtener productos por categoría
  obtenerPorCategoria: async (id) => {
    try {
      const productosPorCategoria = await getProductoByCategory(id);
      return productosPorCategoria; // Retorna los productos de la categoría
    } catch (error) {
      console.error(
        `Error al obtener productos de la categoría con ID: ${id}`,
        error
      );
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },
};

export default ProductoService;
