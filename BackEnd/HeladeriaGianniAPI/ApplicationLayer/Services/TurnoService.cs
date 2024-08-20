using DomainLayer.Interface;
using DomainLayer.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer.Services
{
    public class TurnoService 
    {
        private readonly ITurnoRepository _turnoRepositorio;

        public TurnoService(ITurnoRepository turnoRepositorio)
        {
            _turnoRepositorio = turnoRepositorio;
        }

        public async Task<IEnumerable<Turno>> ObtenerTodosAsync()
        {
            return await _turnoRepositorio.ObtenerTodosAsync();          
        }

        public async Task<Turno> ObtenerTurnoPorIdAsync(int id)
        {
            var turno = await _turnoRepositorio.ObtenerPorIdAsync(id);
            if (turno != null)
            {
                return new Turno
                {
                    Id = turno.Id,
                    EmpleadoId = turno.EmpleadoId,
                    FechaInicio = turno.FechaInicio,
                    FechaFin = turno.FechaFin
                };
            }
            return null;
        }

        public async Task<IEnumerable<Turno>> ObtenerPorFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            var turnos = await _turnoRepositorio.ObtenerPorFechasAsync(fechaDesde, fechaHasta);
            return turnos;
        }
        public async Task IniciarTurnoAsync(Turno turno)
        {
            var nuevoTurno = new Turno
            {
                EmpleadoId = turno.EmpleadoId,
                FechaInicio = turno.FechaInicio,
                Empleado = turno.Empleado
                //FechaFin = turno.FechaFin
            };
            await _turnoRepositorio.IniciarTurnoAsync(turno);
        }

        public async Task FinalizarTurnoAsync(int idTurno, DateTime fechaFin)
        {
            var turno = await _turnoRepositorio.ObtenerPorIdAsync(idTurno);
            if (turno != null)
            {
                turno.FechaFin = fechaFin;
                await _turnoRepositorio.FinalizarTurno(idTurno,fechaFin);
            }
        }

        public async Task EliminarTurno(int idTurno)
        {
            await _turnoRepositorio.EliminarAsync(idTurno);
        } 



       
    }
}
