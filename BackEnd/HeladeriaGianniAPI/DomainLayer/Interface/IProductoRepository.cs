using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface IProductoRepository
    {
        Task<IEnumerable<Producto>> ObtenerProductos();
        Task<IEnumerable<Producto>> ObtenerFavoritos();
        Task<IEnumerable<Producto>> ObtenerProductosPorCategoria(int idCategoria);
        Task<IEnumerable<Producto>> ObtenerProductosPorProveedor(int idPoveedor);
        Task<Producto> ObtenerProductoPorId(int id);
        Task AgregarProducto(Producto producto);
        Task EditarProducto(int id, Producto producto);
        Task EliminarProducto(int id);
        Task AgregarFavorito(int id);
        Task EliminarFavorito(int id);
       
    }
}
