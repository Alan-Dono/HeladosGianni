import {getProductosCategorias} from "../api/ApiCategoriasProductos";
import {getProductoByCategory} from "../api/ApiProducto";

const CategoriaProductoService = {
  // Función para obtener todas las categorías con sus productos
  obtenerCategoriasConProductos: async () => {
    try {
      // Obtén las categorías
      const categoriasData = await getProductosCategorias();
      // Para cada categoría, obtén los productos
      const categoriasConProductos = await Promise.all(
        categoriasData.map(async (categoria) => {
          const productosResponse = await getProductoByCategory(categoria.id);
          return {...categoria, productos: productosResponse};
        })
      );
      return categoriasConProductos;
    } catch (error) {
      console.error("Error al obtener las categorías y productos", error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  },
};

export default CategoriaProductoService;
