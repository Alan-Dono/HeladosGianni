namespace HeladeriaGianniAPI.DTOs.Request
{
    public class DetalleVentaDtoReq
    {
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }
        //public double Subtotal { get; set; }
    }
}
