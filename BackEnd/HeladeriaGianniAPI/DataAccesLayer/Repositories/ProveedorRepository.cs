/*using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccesLayer.Repositories
{
    public class ProveedorRepository : IProveedorRepository
    {
        private readonly HeladeriaDbContext context;

        public ProveedorRepository(HeladeriaDbContext context)
        {
            this.context = context;
        }
        public async Task ActualizarProveedor(Proveedor proveedor)
        {
            context.Update(proveedor);
            await context.SaveChangesAsync();
        }

        public async Task AgregarProveedor(Proveedor proveedor)
        {
            await context.Proveedor.AddAsync(proveedor);
            await context.SaveChangesAsync();
        }

        public async Task EliminarProveedor(int id)
        {
            var proveedorEliminar = await context.Proveedor.FindAsync(id);
            if (proveedorEliminar != null)
            {
                context.Remove(proveedorEliminar);
                await context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Proveedor>> ObtenerProveedores()
        {
            return await context.Proveedor.ToListAsync();
        }

        public async Task<Proveedor> ObtenerProveedorPorId(int id)
        {
            var proveedor = await context.Proveedor.FindAsync(id);
            return proveedor;
        }
    }
}
*/