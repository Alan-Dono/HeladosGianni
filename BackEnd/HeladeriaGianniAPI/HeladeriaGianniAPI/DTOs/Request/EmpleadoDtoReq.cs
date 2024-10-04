namespace HeladeriaGianniAPI.DTOs.Request
{
    public class EmpleadoDtoReq
    {
        public string NombreEmpleado { get; set; } 
        public string ApellidoEmpleado { get; set; } 
        public string? Celular { get; set; }  // Nullable
        public string? FechaContratacion { get; set; } // Formateado como string (yyyy-MM-dd)
    }
}
