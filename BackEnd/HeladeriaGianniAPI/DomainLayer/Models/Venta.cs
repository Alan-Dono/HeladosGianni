using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Venta
    {
        public int Id { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; } = 0;
        public double Descuentos { get; set; } = 0;
        [Required]
        public int IdCierreCaja { get; set; }
        public DateTime? FechaAnulacion { get; set; } // Se usa para registrar el momento de la posible anulacion
        public bool Activa { get; set; } = true; // Se usa para no eliminar la venta de la db
        // Propiedades de navegacion
        public List<DetalleVenta> DetallesVentas { get; set; } = new List<DetalleVenta>();
    }
}
 