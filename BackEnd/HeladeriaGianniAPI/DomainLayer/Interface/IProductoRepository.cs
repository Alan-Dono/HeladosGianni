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
        Task<IEnumerable<Producto>> ObtenerProductosPorCategoria(int idCategoria);
        Task<IEnumerable<Producto>> ObtenerProductosPorProveedor(int idPoveedor);
        Task<Producto> ObtenerProductoPorId(int id);
        Task AgregarProducto(Producto producto);
        Task EditarProducto(Producto producto, int id);
        Task EliminarProducto(int id);
       
    }
}
