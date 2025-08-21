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
        public async Task<IActionResult> FinalizarTurno(int id)
        {
            try
            {
                await _turnoService.FinalizarTurno(id);
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
        public async Task<IActionResult> ObtenerTodos([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25)
        {
            var (turnos, totalCount) = await _turnoService.ObtenerPaginadosAsync(pageNumber, pageSize);
            var turnosDto = _mapper.Map<ICollection<TurnoDtoRes>>(turnos);

            return Ok(new
            {
                totalCount,
                data = turnosDto
            });
        }


        [HttpGet("fechas")]
        public async Task<IActionResult> ObtenerPorFechas(
    [FromQuery] DateTime fechaDesde,
    [FromQuery] DateTime fechaHasta,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 25)
        {
            var (turnos, totalCount) = await _turnoService.ObtenerPorFechasPaginadoAsync(fechaDesde, fechaHasta, pageNumber, pageSize);
            var turnosDto = _mapper.Map<IEnumerable<TurnoDtoRes>>(turnos);

            return Ok(new { data = turnosDto, totalCount });
        }
        /*
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
                }*/

        [HttpGet("activo")]
        public async Task<IActionResult> ObtenerTurnoActivo()
        {
            var turnoActivo = await _turnoService.ObtenerTurnoActivo();
            var turnoDto = _mapper.Map<TurnoDtoRes>(turnoActivo);
            return Ok(turnoDto);
        }

        [HttpGet("{id}/resumen-productos")]
        public async Task<IActionResult> ObtenerResumenProductosDelTurno(int id)
        {
            try
            {
                var turno = await _turnoService.ObtenerTurnoConResumen(id);

                if (turno == null)
                    return NotFound($"No se encontró un turno con ID: {id}");

                var resumen = turno.CierreCajas
                    .SelectMany(c => c.Ventas)
                    .SelectMany(v => v.DetallesVentas)
                    .GroupBy(d => new { d.Producto.NombreProducto, d.PrecioUnitario })
                    .Select(g => new ProductoResumenDtoRes
                    {
                        NombreProducto = g.Key.NombreProducto,
                        Cantidad = g.Sum(x => x.Cantidad),
                        PrecioUnitario = g.Key.PrecioUnitario,
                       
                    })
                    .ToList();

                return Ok(resumen);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpPost("{id}/imprimir-resumen")]
        public async Task<IActionResult> ImprimirResumenTurno(int id)
        {
            try
            {
                await _turnoService.ImprimirResumenTurno(id);
                return Ok("Resumen de turno enviado a la impresora.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al imprimir: {ex.Message}");
            }
        }

        

    }

}