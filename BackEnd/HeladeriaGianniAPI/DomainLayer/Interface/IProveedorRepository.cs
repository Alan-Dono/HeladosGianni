using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface IProveedorRepository
    {
        Task<IEnumerable<Proveedor>> ObtenerProveedores();
        Task<Proveedor> ObtenerProveedorPorId(int id);
        Task AgregarProveedor(Proveedor proveedor);
        Task ActualizarProveedor(Proveedor proveedor);
        Task EliminarProveedor(int id);
    }
}
