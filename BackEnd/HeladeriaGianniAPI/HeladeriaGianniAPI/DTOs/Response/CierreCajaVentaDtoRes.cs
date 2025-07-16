namespace HeladeriaGianniAPI.DTOs.Response
{
    public class CierreCajaVentaDtoRes
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public bool EstaActivo { get; set; }
        public int? IdTurno { get; set; }
        public int IdEmpleado { get; set; }

        // Solo información del empleado, SIN lista de ventas
        public EmpleadoDtoRes Empleado { get; set; }
    }
}
