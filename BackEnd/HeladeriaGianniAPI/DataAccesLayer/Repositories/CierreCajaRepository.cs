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
            try
            {
                await context.CierreCajas.AddAsync(cierreCaja);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al iniciar el cierre de caja.", ex);
            }
        }

        public async Task<CierreCaja> ObtenerCierrePorId(int id)
        {
            try
            {
                var cierreCaja = await context.CierreCajas
                    .Include(c => c.Empleado)
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
