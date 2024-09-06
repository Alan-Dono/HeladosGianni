using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class VentaDtoRes
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        public ICollection<DetalleVentaDtoRes> DetallesVentas { get; set; }
    }
}
