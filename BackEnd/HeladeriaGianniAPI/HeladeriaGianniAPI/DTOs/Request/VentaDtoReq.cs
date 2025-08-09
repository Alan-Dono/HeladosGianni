using DomainLayer.Models;

namespace HeladeriaGianniAPI.DTOs.Request
{
    public class VentaDtoReq
    {
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        public double? Descuentos { get; set; }
        public int IdCierreCaja { get; set; }
        public ICollection<DetalleVentaDtoReq> DetallesVentas { get; set; }
        public ICollection<ConceptoVariosDtoReq>? ConceptosVarios { get; set; } = new List<ConceptoVariosDtoReq>(); // Nuevo
        public string? AclaracionCafeteria { get; set; }
        public string? AclaracionHeladeria { get; set; }
    }
}
