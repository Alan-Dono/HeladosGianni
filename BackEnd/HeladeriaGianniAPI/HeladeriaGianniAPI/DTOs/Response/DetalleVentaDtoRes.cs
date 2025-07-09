

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class DetalleVentaDtoRes
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }
        public double Subtotal { get; set; }
        public ProductoVentaDtoRes Producto { get; set; }
    }
}
