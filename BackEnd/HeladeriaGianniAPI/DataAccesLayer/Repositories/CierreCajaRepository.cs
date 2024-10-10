using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccesLayer.Repositories
{
    public class CierreCajaRepository : ICierreCajaRepository
    {
        private readonly HeladeriaDbContext _context;

        public CierreCajaRepository(HeladeriaDbContext context)
        {
            _context = context;
        }

/*        public async Task AgregarCierreCaja(CierreCaja cierreCaja)
        {
            try
            {
                _context.CierreCajas.Add(cierreCaja);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar el cierre de caja en la capa de datos.", ex);
            }
        }*/

        public async Task FinalizarCaja(int idTurno, DateTime fecha)
        {
            try
            {
                var cierreCaja = await _context.CierreCajas
                    .FirstOrDefaultAsync(c => c.IdTurno == idTurno);

                if (cierreCaja != null)
                {
                    cierreCaja.FechaFin = fecha;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new KeyNotFoundException($"No se encontró un cierre de caja abierto para el turno con ID {idTurno}.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al finalizar la caja en la capa de datos.", ex);
            }
        }

        public async Task IniciarCaja(int idTurno, int idEmpleado, DateTime fecha)
        {
            try
            {
                var nuevoCierreCaja = new CierreCaja
                {
                    IdTurno = idTurno,
                    IdEmpleado = idEmpleado,
                    FechaInicio = fecha
                };

                _context.CierreCajas.Add(nuevoCierreCaja);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al iniciar la caja en la capa de datos.", ex);
            }
        }

        public async Task<ICollection<CierreCaja>> ObtenerCierresPorEmpleado(int id)
        {
            try
            {
                return await _context.CierreCajas
                    //.Include(x => x.Empleado)
                    .Where(c => c.IdEmpleado == id)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los cierres de caja por empleado en la capa de datos.", ex);
            }
        }

        public async Task<CierreCaja> ObtenerCierrePorId(int id)
        {
            try
            {
                var cierreCaja = await _context.CierreCajas
                    //.Include(x => x.Empleado)
                    .FindAsync(id);
                if (cierreCaja == null)
                {
                    throw new KeyNotFoundException($"No se encontró un cierre de caja con el ID {id}.");
                }

                return cierreCaja;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el cierre de caja por ID en la capa de datos.", ex);
            }
        }

        public async Task<ICollection<CierreCaja>> ObtenerCierresPorTurno(int id)
        {
            try
            {
                return await _context.CierreCajas
                    .Include (x => x.Empleado)
                    .Where(c => c.IdTurno == id)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los cierres de caja por turno en la capa de datos.", ex);
            }
        }
    }
}

