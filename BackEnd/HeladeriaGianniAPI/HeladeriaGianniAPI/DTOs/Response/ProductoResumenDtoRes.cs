namespace HeladeriaGianniAPI.DTOs.Response
{
    public class ProductoResumenDtoRes
    {
        public string NombreProducto { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }
        public double Total => Cantidad * PrecioUnitario;
        public int Categoria { get; set; }
    }
}
