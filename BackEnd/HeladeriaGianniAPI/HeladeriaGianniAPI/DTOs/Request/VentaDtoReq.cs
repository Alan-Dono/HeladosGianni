namespace HeladeriaGianniAPI.DTOs.Request
{
    public class VentaDtoReq
    {
        public int EmpleadoId { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        public List<DetalleVentaDtoReq> DetallesVentas { get; set; }
    }
}
