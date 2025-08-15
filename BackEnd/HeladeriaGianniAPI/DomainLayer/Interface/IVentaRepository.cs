using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface IVentaRepository
    {
        Task<ICollection<Venta>> ObtenerVentas();
        Task<Venta> ObtenerVentaPorId(int id);
        Task<ICollection<Venta>> ObtenerPorCierreCaja(int idCierreCaja);
        Task<ICollection<Venta>> ObtenerVentasEntreFechas(DateTime fechaDesde, DateTime fechaHasta);
        Task RegistrarVenta(Venta venta);
        Task AnularVenta (int id);

    }
}
