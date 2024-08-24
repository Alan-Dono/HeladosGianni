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

        public async Task<IEnumerable<Producto>> ObtenerProductosPorProveedor(int idProveedor)
        {
            return await productoRepository.ObtenerProductosPorProveedor(idProveedor);
        }

        public async Task AgregarProducto(Producto producto)
        {
            await productoRepository.AgregarProducto(producto);
        }

        public async Task EditarProducto(Producto producto)
        {
            await productoRepository.EditarProducto(producto);
        }

        public async Task EliminarProducto(int id)
        {
            await productoRepository.EliminarProducto(id);
        }
    }
}
