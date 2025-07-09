using DomainLayer.Models;
using System.ComponentModel.DataAnnotations;

namespace HeladeriaGianniAPI.DTOs.Response
{
    public class ProductoDtoRes
    {
        public int Id { get; set; }
        public string NombreProducto { get; set; }
        public int ProductoCategoriaId { get; set; }
        public double Precio { get; set; }
        public string Descripcion { get; set; }
        public ProductoCategoriaDtoRes ProductoCategoriaDtoRes { get; set; }
        //public ProveedorDtoRes ProveedorDtoRes { get; set; }
    }
}
