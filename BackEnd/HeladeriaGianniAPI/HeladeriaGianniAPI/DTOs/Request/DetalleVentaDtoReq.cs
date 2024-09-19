namespace HeladeriaGianniAPI.DTOs.Request
{
    public class DetalleVentaDtoReq
    {
        //public int VentaId { get; set; } Si estamos creando la venta no tiene id
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }

    }
}
