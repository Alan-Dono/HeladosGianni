using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomainLayer.Models
{
    public class ConfiguracionTema
    {
        [Key]
        public int Id { get; set; }

        public string Colors { get; set; } // JSON string con los colores

        public int? UsuarioId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

       /* // DTO para los colores (no se mapea a la BD)
        [NotMapped]
        public TemaColors ColoresObj
        {
            get => null;
            set { *//* no hacer nada temporalmente *//* }
        }*/
    }

    public class TemaColors
    {
        public string Primary { get; set; }
        public string Secondary { get; set; }
        public string Background { get; set; }
        public string Text { get; set; }
        public string Accent { get; set; }
    }
}