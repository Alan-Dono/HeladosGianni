using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
            try
            {
                return await _context.Empleados.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al obtener todos los empleados.", ex);
            }
        }

        public async Task<Empleado> ObtenerPorIdAsync(int id)
        {
            try
            {
                return await _context.Empleados.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en la capa de datos al obtener el empleado con ID {id}.", ex);
            }
        }

        public async Task AgregarAsync(Empleado empleado)
        {
            try
            {
                await _context.Empleados.AddAsync(empleado);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al agregar un empleado.", ex);
            }
        }

        public async Task ActualizarAsync(Empleado empleado)
        {
            try
            {
                _context.Empleados.Update(empleado);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error en la capa de datos al actualizar un empleado.", ex);
            }
        }

        public async Task EliminarAsync(int id)
        {
            try
            {
                var empleado = await _context.Empleados.FindAsync(id);
                if (empleado != null)
                {
                    _context.Empleados.Remove(empleado);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en la capa de datos al eliminar el empleado con ID {id}.", ex);
            }
        }
    }
}
