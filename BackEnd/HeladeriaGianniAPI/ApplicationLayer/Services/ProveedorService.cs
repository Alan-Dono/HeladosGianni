/*using DomainLayer.Interface;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer.Services
{
    public class ProveedorService
    {
        private readonly IProveedorRepository proveedorRepository;

        public ProveedorService(IProveedorRepository proveedorRepository)
        {
            this.proveedorRepository = proveedorRepository;
        }

        public async Task<IEnumerable<Proveedor>> ObtenerProveedor()
        {
            return await proveedorRepository.ObtenerProveedores();
        }

        public async Task<Proveedor> ObtenerProveedorPorId(int id)
        {
            return await proveedorRepository.ObtenerProveedorPorId(id);
        }

        public async Task AgregarProveedor(Proveedor proveedor)
        {
            await proveedorRepository.AgregarProveedor(proveedor);
        }

        public async Task ActualizarProveedor(Proveedor proveedor)
        {
            await proveedorRepository.ActualizarProveedor(proveedor);
        }

        public async Task EliminarProveedor(int id)
        {
            await proveedorRepository.EliminarProveedor(id);
        }
    }
}
*/