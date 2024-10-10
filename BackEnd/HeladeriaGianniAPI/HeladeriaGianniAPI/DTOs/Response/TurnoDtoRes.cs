namespace HeladeriaGianniAPI.DTOs.Response
{
    public class TurnoDtoRes
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public List<int> IdsCierresCaja { get; set; }
        public double? TotalVentas { get; set; } 
        public double? TotalDescuentos { get; set; } 
        public int CantidadDeVentas { get; set; } = 0;
        public int CantidadCierresParciales { get; set; } = 0;

    }
}
