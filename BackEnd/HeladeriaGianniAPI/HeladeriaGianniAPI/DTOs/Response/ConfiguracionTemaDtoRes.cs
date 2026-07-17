namespace HeladeriaGianniAPI.DTOs.Response
{
    public class ConfiguracionTemaDtoRes
    {
        public int Id { get; set; }
        public TemaColors? Colors { get; set; } // ← Hacer nullable
        public int? UsuarioId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
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