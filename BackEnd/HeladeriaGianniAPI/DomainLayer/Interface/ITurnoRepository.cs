using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface ITurnoRepository
    {
        Task<IEnumerable<Turno>> ObtenerTodosAsync();
        Task<Turno> ObtenerPorIdAsync(int id);
        Task<IEnumerable<Turno>> ObtenerPorFechasAsync(DateTime fechaDesde, DateTime fechaHasta);
        Task IniciarTurnoAsync(Turno turno);
        Task FinalizarTurno(int idTurno, DateTime fechaFin);
        Task EliminarAsync(int id);
    }
}

