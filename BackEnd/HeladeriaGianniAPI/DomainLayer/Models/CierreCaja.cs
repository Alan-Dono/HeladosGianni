using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class CierreCaja
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public double TotalVentas { get; set; } = 0;
        public double TotalDescuentos { get; set; } = 0;
        public int CantidadDeVetnas { get; set; } = 0;
        [Required]
        public int IdTurno { get; set; }
        [Required]
        public int IdEmpleado { get; set; }

        // Propiedades de navegacion
        public Turno Turno { get; set; }
        public Empleado Empleado { get; set; }
        public List<Venta> Ventas { get; set; }
    }
}
