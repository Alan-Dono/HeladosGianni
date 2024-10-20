﻿using DomainLayer.Interface;
using DomainLayer.Models;


namespace ApplicationLayer.Services
{
    public class TurnoService 
    {
        private readonly ITurnoRepository _turnoRepositorio;

        public TurnoService(ITurnoRepository turnoRepositorio)
        {
            _turnoRepositorio = turnoRepositorio;
        }


        public async Task<ICollection<Turno>> ObtenerTodosAsync()
        {
            return await _turnoRepositorio.ObtenerTodosAsync();
        }

        public async Task<Turno> ObtenerPorIdAsync(int id)
        {
            return await _turnoRepositorio.ObtenerPorIdAsync(id);
        }

        public async Task<ICollection<Turno>> ObtenerPorFechasAsync(DateTime fechaDesde, DateTime fechaHasta)
        {
            return await _turnoRepositorio.ObtenerPorFechasAsync(fechaDesde, fechaHasta);
        }

        public async Task IniciarTurnoAsync(Turno turno)
        {
            await _turnoRepositorio.IniciarTurnoAsync(turno);
        }

        public async Task FinalizarTurno(int idTurno)
        {
            await _turnoRepositorio.FinalizarTurno(idTurno);
        }

        public async Task<Turno> ObtenerTurnoActivo()
        {
            return await _turnoRepositorio.ObtenerTurnoActivo();
        }


    }
}
