using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/empleados")]
    public class EmpleadosController : ControllerBase
    {
        private readonly EmpleadoService _empleadoService;
        private readonly IMapper _mapper;

        public EmpleadosController(EmpleadoService empleadoService, IMapper mapper)
        {
            _empleadoService = empleadoService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var empleados = await _empleadoService.ObtenerEmpleadosAsync();
            var empleadosDto = _mapper.Map<IEnumerable<EmpleadoDtoRes>>(empleados);
            return Ok(empleadosDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var empleado = await _empleadoService.ObtenerEmpleadoPorIdAsync(id);
            if (empleado == null)
                return NotFound();

            var empleadoDto = _mapper.Map<EmpleadoDtoRes>(empleado);
            return Ok(empleadoDto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EmpleadoDtoReq empleadoDtoReq)
        {
            var empleado = _mapper.Map<Empleado>(empleadoDtoReq);
            await _empleadoService.AgregarEmpleadoAsync(empleado);
            return CreatedAtAction(nameof(Get), new { id = empleado.Id }, empleadoDtoReq);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] EmpleadoDtoReq empleadoDtoReq)
        {
            var empleado = await _empleadoService.ObtenerEmpleadoPorIdAsync(id);
            if (empleado == null)
                return NotFound();

            _mapper.Map(empleadoDtoReq, empleado);
            await _empleadoService.ActualizarEmpleadoAsync(empleado);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var empleado = await _empleadoService.ObtenerEmpleadoPorIdAsync(id);
            if (empleado == null)
                return NotFound();

            await _empleadoService.EliminarEmpleadoAsync(id);
            return NoContent();
        }
    }
    
}
