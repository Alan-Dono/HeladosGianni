using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class DetalleVenta
    {
        #region Propiedades
        public int Id { get; set; }
        public int VentaId { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }

        // Propiedades de navegacion
        public Producto? Producto { get; set; }

        #endregion
    }
}  
