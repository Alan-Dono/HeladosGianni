using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer.BusinessLogic
{
    public class CalculadoraVentas
    {
        public void AgregarUnaVenta(Venta venta)
        {
            if (venta == null) return;
            SetSubtotalDetalleVenta(venta.DetallesVentas);
            CalcularTotalVenta(venta);
        }

        public Venta VentaConDescuento(Venta venta, double porcentajeDescuento)
        {
            if (porcentajeDescuento < 0 || porcentajeDescuento > 100)
            {
                throw new ArgumentOutOfRangeException(nameof(porcentajeDescuento), "El porcentaje de descuento debe estar entre 0 y 100.");
            }

            double descuento = venta.TotalVenta * (porcentajeDescuento / 100);
            venta.TotalVenta = Math.Round(venta.TotalVenta - descuento, 2);
            return venta;
        }

        private void SetSubtotalDetalleVenta(IEnumerable<DetalleVenta> detalles)
        {
            if (detalles == null) return;  
            foreach(var detalle in detalles)
            {
                detalle.Subtotal = detalle.Cantidad * detalle.PrecioUnitario;
            }
        }

        private double CalcularTotalVenta(Venta venta)
        {
            if (venta == null) return 0;
            double total = 0;
            foreach (DetalleVenta detalle in venta.DetallesVentas)
            {
                total += detalle.Subtotal; // Suma el subtotal al total de la venta
            }
            return Math.Round(total, 2);
        }

    }
}
