namespace HeladeriaGianniAPI.DTOs.Response
{
    public class VentaProductosDtoRes
    {
        public int Id { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        public double Descuentos { get; set; }
        public int IdCierreCaja { get; set; }
        public bool Activa { get; set; }
        public List<DetalleVentaDtoRes> DetalleVenta { get; set; } = new List<DetalleVentaDtoRes>();
        public List<ConceptoVariosDtoRes>? ConceptosVarios { get; set; } = new List<ConceptoVariosDtoRes>();
    }
}
