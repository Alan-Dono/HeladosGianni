using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class ConceptoVarios
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public double Precio { get; set; }

        // Navegacion
        public int IdVenta { get; set; }
        public Venta Venta { get; set; }
    }
}
