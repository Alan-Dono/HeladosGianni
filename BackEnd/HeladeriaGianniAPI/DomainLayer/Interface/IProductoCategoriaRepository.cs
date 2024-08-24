using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface IProductoCategoriaRepository
    {
        Task<IEnumerable<ProductoCategoria>> ObtenerCategorias();
        Task<ProductoCategoria> ObtenerPorId(int id);
        Task AgregarCategoria(ProductoCategoria productoCategoria);
        Task ActualizarCategoria(ProductoCategoria productoCategoria);
        Task EliminarCategoria(int id);
    }
}
