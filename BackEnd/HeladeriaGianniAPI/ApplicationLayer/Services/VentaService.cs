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
        private readonly ImpresoraTicketService impresoraTicketService; 

        public VentaService( IVentaRepository ventaRepository, ImpresoraTicketService impresoraTicketService)
        {
            this.ventaRepository = ventaRepository;
            this.impresoraTicketService = impresoraTicketService;
        }

        public async Task<ICollection<Venta>> ObtenerVentas()
        {
            return await ventaRepository.ObtenerVentas();
        }

        public async Task<Venta> ObtenerVentaPorId(int id)
        {
            return await ventaRepository.ObtenerVentaPorId(id);
        }

        public async Task<ICollection<Venta>> ObtenerPorCierreCaja(int id)
        {
            return await ventaRepository.ObtenerPorCierreCaja(id);
        }


        public async Task<ICollection<Venta>> ObtenerVentasEntreFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            return await ventaRepository.ObtenerVentasEntreFechas(fechaDesde, fechaHasta);
        }

        public async Task RegistrarVenta(Venta venta)
        {
            await ventaRepository.RegistrarVenta(venta);
        }


        public async Task AnularVenta(int id)
        {
            await ventaRepository.AnularVenta(id);
        }
       
      
    }
}
