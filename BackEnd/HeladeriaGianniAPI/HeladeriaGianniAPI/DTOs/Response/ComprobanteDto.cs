namespace HeladeriaGianniAPI.DTOs.Response
{
    public class ComprobanteDto
    {
        public int PuntoVenta { get; set; }
        public int TipoComprobante { get; set; }
        public double Importe { get; set; }
        public string CuitComprador { get; set; }
    }

}
