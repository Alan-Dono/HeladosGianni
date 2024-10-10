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

        public async Task FinalizarTurno(int idTurno, DateTime fechaFin)
        {
            try
            {
                var turno = await _context.Turnos.FindAsync(idTurno);
                if (turno != null)
                {
                    turno.FechaFin = fechaFin;
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
            try
            {
                return await _context.Turnos
                    .Where(t => t.FechaInicio >= fechaDesde && t.FechaInicio <= fechaHasta)
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
                var turno = await _context.Turnos.FindAsync(id);
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
                var turnos = await _context.Turnos.ToListAsync();
                return turnos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la lista de turnos en la capa de datos.", ex);
            }
        }


    }
}
