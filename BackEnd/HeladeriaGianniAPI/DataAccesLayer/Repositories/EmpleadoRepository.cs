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
    public class EmpleadoRepository : IEmpleadoRepository
    {
        private readonly HeladeriaDbContext _context;

        public EmpleadoRepository(HeladeriaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Empleado>> ObtenerTodosAsync()
        {
            return await _context.Empleado.ToListAsync();
        }

        public async Task<Empleado> ObtenerPorIdAsync(int id)
        {
            return await _context.Empleado.FindAsync(id);
        }

        public async Task AgregarAsync(Empleado empleado)
        {
            await _context.Empleado.AddAsync(empleado);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Empleado empleado)
        {
            _context.Empleado.Update(empleado);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(int id)
        {
            var empleado = await _context.Empleado.FindAsync(id);
            if (empleado != null)
            {
                _context.Empleado.Remove(empleado);
                await _context.SaveChangesAsync();
            }
        }
    }
}

