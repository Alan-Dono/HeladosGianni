using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccesLayer.Repositories
{
    public class VentaRepository : IVentaRepository
    {
        private readonly HeladeriaDbContext _context;

        public VentaRepository(HeladeriaDbContext context)
        {
            _context = context;
        }

        public async Task RegistrarVenta(Venta venta)
        {
            try
            {
                venta.FechaDeVenta = DateTime.Now;
                _context.Add(venta);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al registrar la venta.", ex);
            }
        }

        public async Task<Venta> ObtenerVentaPorId(int id)
        {
            try
            {
                return await _context.Ventas
                    .Include(v => v.DetallesVentas)
                        .ThenInclude(dv => dv.Producto)
                        .FirstOrDefaultAsync(v => v.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la venta por ID.", ex);
            }
        }

        public async Task<ICollection<Venta>> ObtenerVentas()
        {
            try
            {
                return await _context.Ventas
                    .Include(x => x.DetallesVentas)
                        .ThenInclude(x => x.Producto)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al obtener todas las ventas.", ex);
            }
        }

        public async Task<ICollection<Venta>> ObtenerVentasEntreFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            try
            {
                return await _context.Ventas
                    .Include(x => x.DetallesVentas)
                        .ThenInclude(x => x.Producto)
                    .Where(x => x.FechaDeVenta >= fechaDesde && x.FechaDeVenta <= fechaHasta)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al obtener ventas entre fechas.", ex);
            }
        }

        public async Task AnularVenta(int id)
        {
            try
            {
                var venta = await _context.Ventas.FindAsync(id);
                if (venta != null)
                {
                    venta.Activa = false;
                    venta.FechaAnulacion = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new Exception("No se encontró la venta para anular.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en la capa de datos al anular la venta con ID {id}.", ex);
            }
        }

        public async Task<ICollection<Venta>> ObtenerPorCierreCaja(int id)
        {
            try
            {
                return await _context.Ventas
                    .Include(x => x.DetallesVentas)
                        .ThenInclude(x => x.Producto)
                    .Where(x => x.IdCierreCaja == id)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en la capa de datos al obtener ventas para el cierre de caja con ID {id}.", ex);
            }
        }
    }
}