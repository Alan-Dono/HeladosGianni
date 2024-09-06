using DomainLayer.Models;

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class VentaDtoRes
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        //public ICollection<DetalleVenta> DetallesVentas { get; set; }

        //public Empleado empleado { get; set; }
    }
}
