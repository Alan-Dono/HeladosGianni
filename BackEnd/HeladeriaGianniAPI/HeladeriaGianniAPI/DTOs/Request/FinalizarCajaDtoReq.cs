using DomainLayer.Models;
using System.ComponentModel.DataAnnotations;

namespace HeladeriaGianniAPI.DTOs.Request
{
    public class FinalizarCajaDtoReq
    {
        public int Id { get; set; }
        public DateTime FechaFin { get; set; }
        public int IdTurno { get; set; }
        public int IdEmpleado { get; set; }


    }
}
