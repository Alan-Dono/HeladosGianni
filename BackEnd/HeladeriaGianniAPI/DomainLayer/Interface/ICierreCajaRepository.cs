using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface ICierreCajaRepository
    {
        Task<ICollection<CierreCaja>> ObtenerCierresPorTurno(int id);
        Task<ICollection<CierreCaja>> ObtenerCierresPorEmpleado(int id);
        Task<CierreCaja> ObtenerCierrePorId(int id);
        //Task AgregarCierreCaja(CierreCaja cierreCaja);
        Task IniciarCaja(int idTurno,int idEmpleado, DateTime fecha);
        Task FinalizarCaja(int idTurno, DateTime fecha);
        

    }
}
