using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public async Task<IEnumerable<Turno>> ObtenerTodosAsync()
        {
            var turnos = await _context.Turnos
             .Include(t => t.Empleado)
             .ToListAsync();
            return turnos;
        }

        public async Task<Turno> ObtenerPorIdAsync(int id)
        {
            var turno = await _context.Turnos
                .Include(x => x.Empleado)
                .FirstOrDefaultAsync(x => x.Id == id);
            return turno;
        }

        public async Task<IEnumerable<Turno>> ObtenerPorFechasAsync(DateTime fechaDesde, DateTime fechaHasta)
        {
            var turnos = await _context.Turnos
                .Where(t => t.FechaInicio >= fechaDesde && t.FechaFin <= fechaHasta)
                .Include(t => t.Empleado)
                .ToListAsync();
            return turnos;
        }

        public async Task IniciarTurnoAsync(Turno turno)
        {
            await _context.Turnos.AddAsync(turno);
            await _context.SaveChangesAsync();
        }

        public async Task FinalizarTurno(int id, DateTime fechaFin)
        {
            var turnoAFinalizar = await _context.Turnos.FindAsync(id);
            turnoAFinalizar.FechaFin = fechaFin;
            _context.Update(turnoAFinalizar);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(int id)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno != null)
            {
                _context.Turnos.Remove(turno);
                await _context.SaveChangesAsync();
            }
        }

    }
}
