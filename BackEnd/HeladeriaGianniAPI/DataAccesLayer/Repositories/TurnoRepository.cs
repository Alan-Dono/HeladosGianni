using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccesLayer.Repositories
{
    public class TurnoRepository : ITurnoRepository
    {
        private readonly HeladeriaDbContext _context;

        public TurnoRepository(HeladeriaDbContext context)
        {
            _context = context;
        }

        public async Task FinalizarTurno(int idTurno)
        {
            try
            {
                // Definir la zona horaria de Argentina
                var zonaHorariaArgentina = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

                var turnoActivo = await _context.Turnos.FindAsync(idTurno);
                if (turnoActivo != null)
                {
                    // Termina el cierre activo
                    var cierre = await _context.CierreCajas.FirstOrDefaultAsync(x => x.EstaActivo == true);
                    if (cierre != null)
                    {
                        // Convertir la fecha UTC a la hora local de Argentina
                        cierre.FechaFin = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArgentina);
                        cierre.EstaActivo = false;
                    }
                    else
                    {
                        throw new InvalidOperationException("No hay un cierre activo para finalizar.");
                    }
                    // Finaliza el turno
                    turnoActivo.FechaFin = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArgentina);
                    turnoActivo.EstaActivo = false;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new KeyNotFoundException($"No se encontró un turno con el ID {idTurno}.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al finalizar el turno en la capa de datos: {ex.Message}", ex);
            }
        }

        public async Task IniciarTurnoAsync(Turno turno)
        {
            try
            {
                _context.Turnos.Add(turno);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al iniciar el turno en la capa de datos.", ex);
            }
        }

        public async Task<ICollection<Turno>> ObtenerPorFechasAsync(DateTime fechaDesde, DateTime fechaHasta)
        {
            if (fechaDesde > fechaHasta)
                throw new ArgumentException("La fecha 'desde' no puede ser mayor que la fecha 'hasta'.");

            try
            {
                // Ajusta fechaHasta para incluir todo el día
                DateTime fechaHastaAjustada = fechaHasta.Date.AddDays(1).AddTicks(-1);

                return await _context.Turnos
                    .Where(t => t.FechaInicio >= fechaDesde.Date && t.FechaInicio <= fechaHastaAjustada)
                    .Include(x => x.CierreCajas)
                        .ThenInclude(x => x.Ventas)
                    .OrderByDescending(x => x.Id)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener turnos por fechas en la capa de datos.", ex);
            }
        }

        public async Task<Turno> ObtenerPorIdAsync(int id)
        {
            try
            {
                var turno = await _context.Turnos
                    .Include(t => t.CierreCajas)
                    .FirstOrDefaultAsync(x => x.Id == id);
                if (turno == null)
                {
                    throw new KeyNotFoundException($"No se encontró un turno con el ID {id}.");
                }

                return turno;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el turno por ID en la capa de datos.", ex);
            }
        }

        public async Task<ICollection<Turno>> ObtenerTodosAsync()
        {
            try
            {
                var turnos = await _context.Turnos
                    .Include(x => x.CierreCajas)
                        .ThenInclude(x => x.Ventas)
                    .OrderByDescending(x => x.Id)
                    .ToListAsync();

                return turnos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la lista de turnos en la capa de datos.", ex);
            }
        }

        public async Task<Turno> ObtenerTurnoActivo()
        {
            try
            {
                var turno = await _context.Turnos
                    .Include(t => t.CierreCajas)
                        .ThenInclude(c => c.Ventas)
                    .Include(t => t.CierreCajas)
                        .ThenInclude(c => c.Empleado)
                    .FirstOrDefaultAsync(t => t.EstaActivo == true);
                return turno;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener turno activo en la capa de datos.", ex);
            }
        }

        public async Task<Turno> ObtenerTurnoConResumen(int id)
        {
            try
            {
                var turno = await _context.Turnos
                    .Include(t => t.CierreCajas)
                        .ThenInclude(c => c.Empleado)
                    .Include(t => t.CierreCajas)
                        .ThenInclude(c => c.Ventas.Where(v => v.Activa))
                            .ThenInclude(v => v.ConceptosVarios)
                    .Include(t => t.CierreCajas)
                        .ThenInclude(c => c.Ventas.Where(v => v.Activa))
                            .ThenInclude(v => v.DetallesVentas)
                                .ThenInclude(dv => dv.Producto)
                                    .ThenInclude(p => p.ProductoCategoria)
                    .OrderByDescending(x => x.Id)
                    .FirstOrDefaultAsync(t => t.Id == id);

                return turno;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el turno con productos", ex);
            }
        }

        // MÉTODO CORREGIDO - Solo trae los IDs primero, luego hace el Include
        public async Task<(ICollection<Turno>, int)> ObtenerPaginadosAsync(int pageNumber, int pageSize)
        {
            try
            {
                // Primero obtener el conteo total sin includes (más eficiente)
                var totalCount = await _context.Turnos.CountAsync();

                // Obtener solo los IDs de los turnos paginados
                var turnoIds = await _context.Turnos
                    .OrderByDescending(t => t.Id)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => t.Id)
                    .ToListAsync();

                // Ahora traer los turnos completos con sus relaciones usando los IDs obtenidos
                var turnos = await _context.Turnos
                    .Where(t => turnoIds.Contains(t.Id))
                    .Include(x => x.CierreCajas)
                        .ThenInclude(x => x.Ventas)
                    .OrderByDescending(t => t.Id)
                    .ToListAsync();

                return (turnos, totalCount);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener turnos paginados en la capa de datos.", ex);
            }
        }

        // MÉTODO CORREGIDO - Aplicar mismo patrón para fechas
        public async Task<(ICollection<Turno>, int)> ObtenerPorFechasPaginadoAsync(DateTime fechaDesde, DateTime fechaHasta, int pageNumber, int pageSize)
        {
            if (fechaDesde > fechaHasta)
                throw new ArgumentException("La fecha 'desde' no puede ser mayor que la fecha 'hasta'.");

            try
            {
                DateTime fechaHastaAjustada = fechaHasta.Date.AddDays(1).AddTicks(-1);

                // Obtener conteo total con filtro de fechas
                var totalCount = await _context.Turnos
                    .Where(t => t.FechaInicio >= fechaDesde.Date && t.FechaInicio <= fechaHastaAjustada)
                    .CountAsync();

                // Obtener solo los IDs de los turnos paginados con filtro de fechas
                var turnoIds = await _context.Turnos
                    .Where(t => t.FechaInicio >= fechaDesde.Date && t.FechaInicio <= fechaHastaAjustada)
                    .OrderByDescending(t => t.Id)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => t.Id)
                    .ToListAsync();

                // Traer los turnos completos con sus relaciones usando los IDs obtenidos
                var turnos = await _context.Turnos
                    .Where(t => turnoIds.Contains(t.Id))
                    .Include(x => x.CierreCajas)
                        .ThenInclude(x => x.Ventas)
                    .OrderByDescending(t => t.Id)
                    .ToListAsync();

                return (turnos, totalCount);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener turnos por fechas paginados en la capa de datos.", ex);
            }
        }
    }
}