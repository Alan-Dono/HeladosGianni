// Elimina la definición duplicada de TemaColors y usa la del namespace Response
using TemaColors = HeladeriaGianniAPI.DTOs.Response.TemaColors;



namespace HeladeriaGianniAPI.DTOs.Request
{
    public class ConfiguracionTemaCreacionDtoReq
    {
        public TemaColors? Colors { get; set; } // ← Hacer nullable
        public int? UsuarioId { get; set; }
    }

    public class ConfiguracionTemaActualizacionDtoReq
    {
        public TemaColors? Colors { get; set; } // ← Hacer nullable
    }

    public class TemaColors
    {
        public string? Primary { get; set; }
        public string? Secondary { get; set; }
        public string? Background { get; set; }
        public string? Text { get; set; }
        public string? Accent { get; set; }
    }
}