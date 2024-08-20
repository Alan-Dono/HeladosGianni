using DomainLayer.Interface;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer.Services
{
    public class EmpleadoService
    {
        private readonly IEmpleadoRepository _empleadoRepository;

        public EmpleadoService(IEmpleadoRepository empleadoRepository)
        {
            _empleadoRepository = empleadoRepository;
        }

        public async Task<IEnumerable<Empleado>> ObtenerEmpleadosAsync()
        {
            return await _empleadoRepository.ObtenerTodosAsync();
        }

        public async Task<Empleado> ObtenerEmpleadoPorIdAsync(int id)
        {
            return await _empleadoRepository.ObtenerPorIdAsync(id);
        }

        public async Task AgregarEmpleadoAsync(Empleado empleado)
        {
            await _empleadoRepository.AgregarAsync(empleado);
        }

        public async Task ActualizarEmpleadoAsync(Empleado empleado)
        {
            await _empleadoRepository.ActualizarAsync(empleado);
        }

        public async Task EliminarEmpleadoAsync(int id)
        {
            await _empleadoRepository.EliminarAsync(id);
        }

    }
}

