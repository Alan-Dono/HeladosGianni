using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        public string NombreEmpleado { get; set; }
        public string ApellidoEmpleado { get; set; }

        public string? Celular { get; set; }  // Nullable

        public DateOnly? FechaContratacion { get; set; }  // Nullable para permitir fechas no definidas


    }
}
