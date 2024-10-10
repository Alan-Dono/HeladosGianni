using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/cierres")]
    public class CierreCajaController : ControllerBase
    {
        private readonly CierreCajaService _cierreCajaService;
        private readonly IMapper _mapper;

        public CierreCajaController(CierreCajaService cierreCajaService, IMapper mapper)
        {
            _cierreCajaService = cierreCajaService;
            _mapper = mapper;
        }


        // Método para obtener un cierre de caja por su ID
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerCierrePorId(int id)
        {
            var cierre = await _cierreCajaService.ObtenerCierrePorId(id);

            if (cierre == null)
            {
                return NotFound($"No se encontró un cierre de caja con ID: {id}");
            }

            var cierreDtoRes = _mapper.Map<CierreCajaDtoRes>(cierre);
            return Ok(cierreDtoRes);
        }

        // Método para obtener todos los cierres de caja por ID del turno
        [HttpGet("turno/{turnoId}")]
        public async Task<IActionResult> ObtenerCierresPorTurnoId(int turnoId)
        {
            var cierres = await _cierreCajaService.ObtenerCierresPorTurno(turnoId);

            if (cierres == null || cierres.Count == 0)  // Se asegura de que haya resultados
            {
                return NotFound($"No se encontraron cierres de caja para el turno con ID: {turnoId}");
            }

            var cierresDtoRes = _mapper.Map<List<CierreCajaDtoRes>>(cierres);
            return Ok(cierresDtoRes);
        }

        // Método para obtener todos los cierres de caja por ID del empleado
        [HttpGet("empleado/{empleadoId}")]
        public async Task<IActionResult> ObtenerCierresPorEmpleadoId(int empleadoId)
        {
            var cierres = await _cierreCajaService.ObtenerCierresPorEmpleado(empleadoId);

            if (cierres == null || cierres.Count == 0)  // Se asegura de que haya resultados
            {
                return NotFound($"No se encontraron cierres de caja para el empleado con ID: {empleadoId}");
            }

            var cierresDtoRes = _mapper.Map<List<CierreCajaDtoRes>>(cierres);
            return Ok(cierresDtoRes);
        }

        // Método para finalizar una caja
        [HttpPut("finalizar/{turnoId}")]
        public async Task<IActionResult> FinalizarCaja(int turnoId, [FromBody] DateTime fecha)
        {
            try
            {
                await _cierreCajaService.FinalizarCaja(turnoId, fecha);
                return NoContent(); // No hay contenido para devolver, solo confirmación
            }
            catch (KeyNotFoundException)
            {
                return NotFound($"No se encontró un cierre de caja abierto para el turno con ID: {turnoId}.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al finalizar la caja: {ex.Message}"); // Manejo de otros errores
            }
        }

        // Método para iniciar una caja
        [HttpPost("iniciar")]
        public async Task<IActionResult> IniciarCaja([FromBody] CierreCajaDtoReq iniciarCajaDtoReq)
        {
            if (iniciarCajaDtoReq == null)
            {
                return BadRequest("La información para iniciar la caja es requerida.");
            }

            await _cierreCajaService.IniciarCaja(iniciarCajaDtoReq.IdTurno, iniciarCajaDtoReq.IdEmpleado, iniciarCajaDtoReq.Fecha);
            return Created("Cierre de caja iniciado exitosamente", null); // Mensaje de éxito, puedes modificar según necesites
        }
    }
}
