using System.ComponentModel.DataAnnotations;

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class CierreCajaDtoRes
    {
        public int Id { get; set; }
        public double TotalVentas { get; set; }
        public double TotalDescuentos { get; set; }
        public int CantidadDeVetnas { get; set; } = 0;
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public int IdTurno { get; set; }
        // Navegation
        public EmpleadoDtoRes Empleado { get; set; }
        //public TurnoDtoRes? Turno { get; set; }
        public ICollection<VentaDtoRes> Ventas { get; set; } = new List<VentaDtoRes>();
    }
}
