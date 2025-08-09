using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccesLayer.Repositories
{
    public class CierreCajaRepository : ICierreCajaRepository
    {
        private readonly HeladeriaDbContext context;

        public CierreCajaRepository(HeladeriaDbContext context)
        {
            this.context = context;
        }

        public async Task CambiarResponsable(int idCierre, CierreCaja cierreCajaNuevo)
        {
            var zonaHorariaArgentina = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            try
            {
                var cierreCaja = await context.CierreCajas.FindAsync(idCierre);
                if (cierreCaja == null)
                    throw new KeyNotFoundException($"No se encontró un cierre de caja con el ID {idCierre}.");

                cierreCaja.FechaFin = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArgentina);
                cierreCaja.EstaActivo = false;
                context.Update(cierreCaja);
                await context.SaveChangesAsync();
                await IniciarCaja(cierreCajaNuevo);
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al cambiar el responsable del cierre de caja.", ex);
            }
        }

        public async Task IniciarCaja(CierreCaja cierreCaja)
        {
            var zonaHorariaArgentina = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            if (cierreCaja.IdTurno == null)
            {
                var fechaInicioTurno = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArgentina);
                var nuevoTurno = new Turno { FechaInicio = fechaInicioTurno };
                await context.Turnos.AddAsync(nuevoTurno);
                await context.SaveChangesAsync();
                var turno = await context.Turnos.FirstOrDefaultAsync(x => x.EstaActivo == true);
                cierreCaja.IdTurno = turno.Id;
            }
            try
            {
                cierreCaja.FechaInicio = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArgentina);
                await context.CierreCajas.AddAsync(cierreCaja);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al iniciar el cierre de caja.", ex);
            }
        }

        public async Task<CierreCaja> ObtenerCierreActivo()
        {
            try
            {
                var cierre = await context.CierreCajas
                    .Include(x => x.Empleado)
                    .Include(x => x.Ventas
                        .Where(v => v.Activa == true))
                        .ThenInclude(v => v.DetallesVentas)
                    .FirstOrDefaultAsync(x => x.EstaActivo == true);

                return cierre;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener cierre en la capa de datos", ex);
            }
        }

        public async Task<CierreCaja> ObtenerCierrePorId(int id)
        {
            try
            {
                var cierreCaja = await context.CierreCajas
                    .Include(c => c.Empleado)
                    .Include(v => v.Ventas)
                    .FirstOrDefaultAsync(c => c.Id == id);
                return cierreCaja;
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al obtener el cierre de caja por ID.", ex);
            }
        }

        public async Task<ICollection<CierreCaja>> ObtenerCierresPorEmpleado(int id)
        {
            try
            {
                var cierres = await context.CierreCajas
                    .Include(x => x.Ventas)
                    .Where(c => c.IdEmpleado == id)
                    .OrderByDescending(c => c.FechaInicio) // Orden descendente por fecha
                    .ToListAsync();
                return cierres;
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al obtener cierres de caja por empleado.", ex);
            }
        }

        public async Task<ICollection<CierreCaja>> ObtenerCierresPorTurno(int id)
        {
            try
            {
                var cierres = await context.CierreCajas
                    .Include(c => c.Empleado)
                    .Include(x => x.Ventas)
                    .Where(c => c.IdTurno == id)
                    .OrderByDescending(c => c.FechaInicio) // Orden descendente por fecha
                    .ToListAsync();
                return cierres;
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al obtener cierres de caja por turno.", ex);
            }
        }

        public async Task<CierreCaja> ObtenerCierreConDetalles(int id)
        {
            try
            {
                var cierre = await context.CierreCajas
                    .Include(c => c.Empleado)
                    .Include(c => c.Ventas)
                        .ThenInclude(v => v.DetallesVentas)
                            .ThenInclude(dv => dv.Producto)
                               .ThenInclude(p => p.ProductoCategoria)
                    .FirstOrDefaultAsync(c => c.Id == id);

                return cierre;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el cierre con detalles.", ex);
            }
        }
    }
}