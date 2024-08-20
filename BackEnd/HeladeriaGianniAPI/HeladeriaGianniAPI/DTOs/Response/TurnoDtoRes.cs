namespace HeladeriaGianniAPI.DTOs.Response
{
    public class TurnoDtoRes
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public EmpleadoDtoRes Empleado { get; set; }

    }
}
