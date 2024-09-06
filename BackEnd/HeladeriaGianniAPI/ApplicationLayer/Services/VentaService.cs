using DomainLayer.Interface;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer.Services
{
    public class VentaService
    {
        private readonly IVentaRepository ventaRepository;

        public VentaService( IVentaRepository ventaRepository)
        {
            this.ventaRepository = ventaRepository;
        }

        public async Task<ICollection<Venta>> ObtenerVentas()
        {
            return await ventaRepository.ObtenerVentas();
        }

        public async Task<Venta> ObtenerVentaPorId(int id)
        {
            return await ventaRepository.ObtenerVentaPorId(id);
        }

        public async Task<ICollection<Venta>> ObtenerVentasEntreFechas(DateTime desde, DateTime hasta)
        {
            return await ventaRepository.ObtenerVentasEntreFechas(desde, hasta);
        }

        public async Task AgregarVenta(Venta venta)
        {
            await ventaRepository.AgregarVenta(venta);
        }

        public async Task EliminarVenta(int id)
        {
            await ventaRepository.EliminarVenta(id);
        }
    }
}
