using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Turno
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public double TotalVentas { get; set; } = 0;
        public double TotalDescuentos { get; set; } = 0;
        public int CantidadDeVentas { get; set; } = 0;  
        public int CantidadCierresParciales { get; set; } = 0;
        public bool EstaActivo { get; set; } = true;

        // Propiedad navegacion
        public ICollection<CierreCaja> CierreCajas { get; set; } = new List<CierreCaja>();
    }
}