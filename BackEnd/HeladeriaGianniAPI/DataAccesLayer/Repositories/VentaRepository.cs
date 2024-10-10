using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DataAccesLayer.Repositories
{
    public class VentaRepository : IVentaRepository
    {
        private readonly HeladeriaDbContext context;

        public VentaRepository(HeladeriaDbContext context)
        {
            this.context = context;
        }
        public async Task RegistrarVenta(Venta venta)
        {
            context.Add(venta);
            await context.SaveChangesAsync();
        }

        public async Task<Venta> ObtenerVentaPorId(int id)
        {
            var existe = await context.Ventas
                .Include(x => x.DetallesVentas)
                    .ThenInclude(x => x.Producto)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existe == null)
            {
                throw new Exception("No se encontro la venta");
            }
            return existe;
        }

        public async Task<ICollection<Venta>> ObtenerVentas()
        {
            var ventas = await context.Ventas
                .Include(x => x.DetallesVentas)
                    .ThenInclude(x => x.Producto)
                .ToListAsync();
            return ventas;
        }

        public async Task<ICollection<Venta>> ObtenerVentasEntreFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            var ventas = await context.Ventas
                .Include(x => x.DetallesVentas)
                    .ThenInclude(x => x.Producto)
                .Where(x => x.FechaDeVenta >= fechaDesde && x.FechaDeVenta <= fechaHasta)             
                .ToListAsync();
            return ventas;
        }

        public async Task AnularVenta(int id)
        {
            var existe = await context.Ventas.FindAsync(id);
            if (existe != null)
            {
                // Desactivar la venta
                existe.Activa = false;

                // Establecer un valor en otra propiedad
                existe.FechaAnulacion = DateTime.UtcNow; // Ejemplo: estableciendo la fecha de anulación

                // Guardar los cambios en la base de datos
                await context.SaveChangesAsync();
            }
        }

        public async Task<ICollection<Venta>> ObtenerPorCierreCaja(int id)
        {
            var ventas = await context.Ventas
                .Include(x => x.DetallesVentas)
                    .ThenInclude(x => x.Producto)
                .Where(x => x.IdCierreCaja == id)
                .ToListAsync();
            return ventas;
        }
    }
}
