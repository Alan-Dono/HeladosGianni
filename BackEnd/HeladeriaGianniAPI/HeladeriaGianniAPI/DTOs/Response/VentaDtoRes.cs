using DomainLayer.Models;

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class VentaDtoRes
    {
        public int Id { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        public double Descuentos { get; set; }
        public int IdCierreCaja { get; set; }
        public List<int> IdsDetalleVentas { get; set; } = new List<int>();
    }
}
