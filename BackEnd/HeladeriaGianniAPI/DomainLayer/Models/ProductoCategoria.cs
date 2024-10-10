using System.ComponentModel.DataAnnotations;

namespace DomainLayer.Models
{
    public class ProductoCategoria
    {
        public int Id { get; set; }
        [Required]
        public string NombreCategoria { get; set; } 
    }
}