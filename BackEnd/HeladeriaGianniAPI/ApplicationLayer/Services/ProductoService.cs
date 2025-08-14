using DomainLayer.Interface;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer.Services
{
    public class ProductoService
    {
        private readonly IProductoRepository productoRepository;

        public ProductoService(IProductoRepository productoRepository)
        {
            this.productoRepository = productoRepository;
        }

        public async Task<IEnumerable<Producto>> ObtenerProductos()
        {
            return await productoRepository.ObtenerProductos();
        }

        public async Task<Producto> ObtenerProductosPorId(int id)
        {
             return await productoRepository.ObtenerProductoPorId(id);
        }

        public async Task<IEnumerable<Producto>> ObtenerProductosPorCategoria(int idCategoria)
        {
            return await productoRepository.ObtenerProductosPorCategoria(idCategoria);
        }

        

        public async Task AgregarProducto(Producto producto)
        {
            await productoRepository.AgregarProducto(producto);
        }

        public async Task EditarProducto(int id, Producto producto)
        {
            await productoRepository.EditarProducto(id, producto);
        }

        public async Task EliminarProducto(int id)
        {
            await productoRepository.EliminarProducto(id);
        }

        public async Task AgregarAFavorito(int id)
        {
            await productoRepository.AgregarFavorito(id);
        }

        public async Task EliminarDeFavorito(int id)
        {
            await productoRepository.EliminarFavorito(id);
        }

        public async Task<IEnumerable<Producto>> ObtenerFavoritos()
        {
            return await productoRepository.ObtenerFavoritos();
        }

        public async Task ActualizarOrdenProductos(Dictionary<int, int> ordenProductos)
        {
            await productoRepository.ActualizarOrdenProductos(ordenProductos);
        }

    }
}
