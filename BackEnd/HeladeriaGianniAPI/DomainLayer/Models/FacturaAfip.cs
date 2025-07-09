using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class FacturaAfip
    {
        public int Id { get; set; }
        public int VentaId { get; set; } 
        public int PuntoVenta { get; set; }
        public int TipoComprobante { get; set; }
        public long NumeroComprobante { get; set; }
        public string CAE { get; set; }
        public DateTime FechaVencimientoCAE { get; set; }
        public DateTime FechaEmision { get; set; }
        public string QRBase64 { get; set; }

        public Venta Venta { get; set; }
    }

}
