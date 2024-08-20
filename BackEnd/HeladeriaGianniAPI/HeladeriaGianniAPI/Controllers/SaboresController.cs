using ApplicationLayer;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/sabores")]
    public class SaboresController : ControllerBase
    {
        private readonly GestionarSabores _gestionarSabores;
        private readonly IMapper _mapper;

        public SaboresController(GestionarSabores gestionarSabores, IMapper mapper)
        {
            _gestionarSabores = gestionarSabores;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var sabores = await _gestionarSabores.ObtenerSaboresAsync();
            var saboresDto = _mapper.Map<IEnumerable<SaborDtoRes>>(sabores);
            return Ok(saboresDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var sabor = await _gestionarSabores.ObtenerSaborPorIdAsync(id);
            if (sabor == null)
                return NotFound();

            var saborDto = _mapper.Map<SaborDtoRes>(sabor);
            return Ok(saborDto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SaborDtoReq saborDtoReq)
        {
            var sabor = _mapper.Map<Sabor>(saborDtoReq);
            await _gestionarSabores.AgregarSaborAsync(sabor);
            return CreatedAtAction(nameof(Get), new { id = sabor.Id }, saborDtoReq);
        }
    }
}
