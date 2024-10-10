using DomainLayer.Interface;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

/*        public async Task AgregarCierreCaja(CierreCaja cierreCaja)
        {
            await cierreCajaRepository.AgregarCierreCaja(cierreCaja);
        }*/

        public async Task IniciarCaja(int idTurno, int idEmpleado, DateTime fecha)
        {
            await cierreCajaRepository.IniciarCaja(idTurno, idEmpleado, fecha);
        }

        public async Task FinalizarCaja(int idTurno, DateTime fecha)
        {
            await cierreCajaRepository.FinalizarCaja(idTurno, fecha);
        }
    }
}
