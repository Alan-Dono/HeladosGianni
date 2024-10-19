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
            try
            {
                var cierreCaja = await context.CierreCajas.FindAsync(idCierre);
                if (cierreCaja == null)
                    throw new KeyNotFoundException($"No se encontró un cierre de caja con el ID {idCierre}.");

                // Cambia el responsable
                cierreCaja.FechaFin = DateTime.UtcNow; 
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
            // Definir la zona horaria de Argentina
            var zonaHorariaArgentina = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            if (cierreCaja.IdTurno == null) // Recordar pasar null en caso de no tener turno activo
            {
                // Convertir la fecha UTC a la hora local de Argentina
                var fechaInicioTurno = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArgentina);
                var nuevoTurno = new Turno { FechaInicio = fechaInicioTurno };
                await context.Turnos.AddAsync(nuevoTurno);
                await context.SaveChangesAsync();
                var turno = await context.Turnos.FirstOrDefaultAsync(x => x.EstaActivo == true);
                cierreCaja.IdTurno = turno.Id;
            }
            try
            {
                // Convertir la fecha UTC a la hora local de Argentina
                cierreCaja.FechaInicio = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArgentina);
                await context.CierreCajas.AddAsync(cierreCaja);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al iniciar el cierre de caja.", ex);
            }
        }


        /*public async Task IniciarCaja(CierreCaja cierreCaja)
        {
            if (cierreCaja.IdTurno == null) // Recordar pasar null en caso de no tener turno activo
            {
                var nuevoTurno = new Turno{ FechaInicio = DateTime.UtcNow };
                await context.Turnos.AddAsync(nuevoTurno);
                await context.SaveChangesAsync();
                var turno = await context.Turnos.FirstOrDefaultAsync(x => x.EstaActivo == true);
                cierreCaja.IdTurno = turno.Id;
            }
            try
            {
                cierreCaja.FechaInicio = DateTime.UtcNow;
                await context.CierreCajas.AddAsync(cierreCaja);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al iniciar el cierre de caja.", ex);
            }
        }*/

        public async Task<CierreCaja> ObtenerCierreActivo()
        {
            try
            {
                var cierre = await context.CierreCajas
                    .Include(x => x.Empleado)
                    .Include(x => x.Ventas)
                        .ThenInclude(x => x.DetallesVentas)
                    .FirstOrDefaultAsync(x => x.EstaActivo == true);
                return cierre;
            }
            catch(Exception ex)
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
                    .Include (c => c.Empleado)
                    .Include(x => x.Ventas)
                    .Where(c => c.IdTurno == id)
                    .ToListAsync();
                return cierres;
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al obtener cierres de caja por turno.", ex);
            }
        }
    }
}
