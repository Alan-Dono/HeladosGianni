using DomainLayer.Interface;
using DomainLayer.Models;


namespace ApplicationLayer.Services
{
    public class CierreCajaService
    {
        private readonly ICierreCajaRepository cierreCajaRepository;

        public CierreCajaService(ICierreCajaRepository cierreCajaRepository)
        {
            this.cierreCajaRepository = cierreCajaRepository;
        }

        public async Task<ICollection<CierreCaja>> ObtenerCierresPorTurno(int id)
        {
            return await cierreCajaRepository.ObtenerCierresPorTurno(id);
        }

        public async Task<ICollection<CierreCaja>> ObtenerCierresPorEmpleado(int id)
        {
            return await cierreCajaRepository.ObtenerCierresPorEmpleado(id);
        }

        public async Task<CierreCaja> ObtenerCierrePorId(int id)
        {
            return await cierreCajaRepository.ObtenerCierrePorId(id);
        }

        public async Task IniciarCaja(CierreCaja cierreCaja)
        {
            await cierreCajaRepository.IniciarCaja(cierreCaja);
        }

        public async Task CambiarResponsable(int idCierre, CierreCaja cajaNueva)
        {
            await cierreCajaRepository.CambiarResponsable(idCierre, cajaNueva);
        }

        public async Task<CierreCaja> ObtenerCierreActivo()
        {
            return await cierreCajaRepository.ObtenerCierreActivo();
        }

        public async Task<CierreCaja> ObtenerCierreConResumen(int id)
        {
            return await cierreCajaRepository.ObtenerCierreConDetalles(id);
        }

        public async Task ImprimirResumenCierre(int idCierre)
        {
            var cierre = await cierreCajaRepository.ObtenerCierreConDetalles(idCierre);

            if (cierre == null)
                throw new KeyNotFoundException($"No se encontró el cierre de caja con ID: {idCierre}");

            var impresora = new ImpresoraVarios(cierre);
            impresora.Imprimir();
        }


    }
}
