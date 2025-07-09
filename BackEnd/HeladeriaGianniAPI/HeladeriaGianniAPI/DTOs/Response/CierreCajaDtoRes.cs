using System.ComponentModel.DataAnnotations;

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class CierreCajaDtoRes
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public bool EstaActivo { get; set; }
        public int IdTurno { get; set; }
        public int CantidadDeVentas { get; set; } = 0;
        public double TotalDeVentas { get; set; } = 0;
        public double TotalDescuentos { get; set; } = 0;
        public List<int> IdsVentas { get; set; } = new List<int>();
        // Navegation
        public EmpleadoDtoRes? Empleado { get; set; }
    }
}
