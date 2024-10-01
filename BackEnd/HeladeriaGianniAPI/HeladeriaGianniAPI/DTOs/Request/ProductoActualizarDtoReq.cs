using DomainLayer.Models;
using System.ComponentModel.DataAnnotations;

namespace HeladeriaGianniAPI.DTOs.Request
{
    public class ProductoActualizarDtoReq
    {
        public int Id { get; set; }
        [Required]
        public int ProductoCategoriaId { get; set; }
        [MaxLength(150)]
        public string Descripcion { get; set; }

        [Required]
        public string NombreProducto { get; set; }


        [Required]
        [RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "El campo Precio debe ser un número válido con hasta dos decimales.")]
        [Range(0, double.MaxValue, ErrorMessage = "El campo precio debe ser mayor a 0")]
        public double Precio { get; set; }

    }
}
