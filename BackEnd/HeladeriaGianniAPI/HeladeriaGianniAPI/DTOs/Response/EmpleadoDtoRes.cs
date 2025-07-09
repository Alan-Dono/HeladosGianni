namespace HeladeriaGianniAPI.DTOs.Response
{
    public class EmpleadoDtoRes
    {
        public int Id { get; set; }
        public string NombreEmpleado { get; set; }  
        public string ApellidoEmpleado { get; set; } 
        public string? Celular { get; set; }  // Nullable
        public string? FechaContratacion { get; set; } // Formateado como string, ya que DateOnly no puede ser nulo
        
    
    }
}
