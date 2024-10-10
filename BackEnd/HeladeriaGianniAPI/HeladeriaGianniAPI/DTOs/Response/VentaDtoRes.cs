using DomainLayer.Models;

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class VentaDtoRes
    {
        public int Id { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        public double? Descuentos { get; set; }
        public int IdCierreCaja { get; set; }
        public int IdTurno { get; set; }
        public ICollection<DetalleVentaDtoRes> DetallesVentas { get; set; }
    }
}
