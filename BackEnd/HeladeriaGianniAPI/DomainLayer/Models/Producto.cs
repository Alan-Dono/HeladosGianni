using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Producto
    {
        public int Id { get; set; }
        public string NombreProducto { get; set; }
        public int ProductoCategoriaId { get; set; }
        public int ProveedorId { get; set; }
        public double Precio { get; set; }
        public string Descripcion { get; set; }
        public ProductoCategoria productoCategoria { get; set; }
        public Proveedor Proveedor { get; set; } 
    }
}
