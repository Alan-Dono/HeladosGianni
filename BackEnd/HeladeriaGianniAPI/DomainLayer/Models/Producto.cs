using System.ComponentModel.DataAnnotations;

namespace DomainLayer.Models
{
    public class Producto
    {
        public int Id { get; set; }
        [Required]
        public string NombreProducto { get; set; }
        [Required]
        public int ProductoCategoriaId { get; set; }
        //[Required]
        //public int ProveedorId { get; set; }
        [Required]
        [RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "El campo Precio debe ser un número válido con hasta dos decimales.")]
        [Range(0, double.MaxValue ,ErrorMessage = "El campo precio debe ser mayor a 0")]
        public double Precio { get; set; }
        [MaxLength(150)]
        public string? Descripcion { get; set; }
        public bool EsFavorito { get; set; } = false;

        // Propiedades de navegacion
        public ProductoCategoria? ProductoCategoria { get; set; }
        //public Proveedor? Proveedor { get; set; } 
    }
}
