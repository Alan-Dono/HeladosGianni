using DomainLayer.Models;
using System.ComponentModel.DataAnnotations;

namespace HeladeriaGianniAPI.DTOs.Request
{
    public class IniciarCajaDtoReq
    {
        public int IdTurno { get; set; }
        public int IdEmpleado { get; set; }
        public DateTime FechaInicio { get; set; }
    }
}