using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Venta
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public DateTime FechaDeVenta { get; set; }
        public double TotalVenta { get; set; }
        public ICollection<DetalleVenta> DetallesVentas { get; set; }

        public Empleado empleado { get; set; }
    }
}
