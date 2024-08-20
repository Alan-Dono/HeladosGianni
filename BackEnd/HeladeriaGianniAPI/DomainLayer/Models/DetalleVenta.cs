using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class DetalleVenta
    {   

        #region Constructor
        public DetalleVenta()
        {
            
        }

        public DetalleVenta(int id, int ventaId, int productoId, int cantidad, double precioUnitario, double subtotal, Venta venta, Producto producto)
        {
            Id = id;
            VentaId = ventaId;
            ProductoId = productoId;
            Cantidad = cantidad;
            PrecioUnitario = precioUnitario;
            Subtotal = subtotal;
            Venta = venta;
            Producto = producto;
        }

        #endregion

        #region Propiedades
        public int Id { get; set; }
        public int VentaId { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }
        public double Subtotal { get; set; }
        public Venta Venta { get; set; }
        public Producto Producto { get; set; }

        #endregion
    }
}
