using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/turnos")]
    public class TurnosController : ControllerBase
    {
        private readonly TurnoService _turnoService;
        private readonly IMapper _mapper;

        public TurnosController(TurnoService turnoService, IMapper mapper)
        {
            _turnoService = turnoService;
            _mapper = mapper;
        }
        
        [HttpPost("iniciar")]
        public async Task<IActionResult> IniciarTurno([FromBody] TurnoDtoReq turnoDtoReq)
        {
            var turno = _mapper.Map<Turno>(turnoDtoReq);
            await _turnoService.IniciarTurnoAsync(turno);
            var turnoDtoRes = _mapper.Map<TurnoDtoRes>(turno);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = turno.Id }, turnoDtoRes);
        }

        [HttpPost("finalizar/{id}")]
        public async Task<IActionResult> FinalizarTurno(int id, [FromBody] DateTime fechaFin)
        {
            try
            {
                await _turnoService.FinalizarTurno(id, fechaFin);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var turno = await _turnoService.ObtenerPorIdAsync(id);
            if (turno == null)
                return NotFound();

            var turnoDto = _mapper.Map<TurnoDtoRes>(turno);
            return Ok(turnoDto);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var turnos = await _turnoService.ObtenerTodosAsync();
            var turnosDto = _mapper.Map<ICollection<TurnoDtoRes>>(turnos);
            return Ok(turnosDto);
        }

        [HttpGet("fechas")]
        public async Task<IActionResult> ObtenerPorFechas([FromQuery] DateTime fechaDesde, [FromQuery] DateTime fechaHasta)
        {
            var turnos = await _turnoService.ObtenerPorFechasAsync(fechaDesde, fechaHasta);
            var turnosDto = _mapper.Map<IEnumerable<TurnoDtoRes>>(turnos);
            return Ok(turnosDto);
        }

        
    }

}