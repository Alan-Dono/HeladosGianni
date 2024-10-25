using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        [Required]
        public string NombreEmpleado { get; set; }
        [Required]
        public string ApellidoEmpleado { get; set; }

        public string? Celular { get; set; }  // Nullable

        public DateTime? FechaContratacion { get; set; }  // Nullable para permitir fechas no definidas

        public bool Activo { get; set; } = true;

    }
}
