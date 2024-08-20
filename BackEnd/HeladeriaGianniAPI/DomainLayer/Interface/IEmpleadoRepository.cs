using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface IEmpleadoRepository
    {
        Task<IEnumerable<Empleado>> ObtenerTodosAsync();
        Task<Empleado> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Empleado empleado);
        Task ActualizarAsync(Empleado empleado);
        Task EliminarAsync(int id);
    }
}
