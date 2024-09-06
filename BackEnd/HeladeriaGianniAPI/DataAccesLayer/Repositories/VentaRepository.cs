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
        public async Task AgregarVenta(Venta venta)
        {
            context.Add(venta);
            await context.SaveChangesAsync();
        }

        public async Task EliminarVenta(int id)
        {
            var existe = await context.Ventas.FindAsync(id);
            if (existe != null)
            {
                context.Remove(id);
                await context.SaveChangesAsync();
            }

        }

        public async Task<Venta> ObtenerVentaPorId(int id)
        {
            var existe = await context.Ventas.FindAsync(id);
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
                .Include(x=> x.empleado)
                .ToListAsync();
            return ventas;
        }

        public async Task<ICollection<Venta>> ObtenerVentasEntreFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            var ventas = await context.Ventas
                .Where(x => x.FechaDeVenta >= fechaDesde && x.FechaDeVenta <= fechaHasta)
                .Include(x => x.DetallesVentas)
                .Include(x => x.empleado)
                .ToListAsync();
            return ventas;
        }
    }
}
