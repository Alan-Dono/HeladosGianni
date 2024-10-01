/*using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Interface;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/proveedores")]
    public class ProveedorController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IProveedorRepository proveedorRepository;

        public ProveedorController(IMapper mapper, IProveedorRepository proveedorRepository)
        {
            this.mapper = mapper;
            this.proveedorRepository = proveedorRepository;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerProveedores()
        {
            var proveedor = await proveedorRepository.ObtenerProveedores();
            if (proveedor == null)
            {
                return NotFound("No se encontraro Categorias");
            }
            var proveedorDtos = mapper.Map<IEnumerable<ProveedorDtoRes>>(proveedor);
            return Ok(proveedorDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerProveedorPorId(int id)
        {
            var proveedor = await proveedorRepository.ObtenerProveedorPorId(id);
            if (proveedor == null)
            {
                return NotFound("Proveedor no encontrado");
            }
            return Ok(mapper.Map<ProveedorDtoRes>(proveedor));
        }

        [HttpPost]
        public async Task<IActionResult> CrearProveedor([FromBody] ProveedorDtoReq productoCategoriaDtoReq)
        {
            var proveedor = mapper.Map<Proveedor>(productoCategoriaDtoReq);
            await proveedorRepository.AgregarProveedor(proveedor);
            return CreatedAtAction(nameof(ObtenerProveedorPorId),// Devuelve 201 Created con la ubicación del recurso creado.
                new { id = proveedor.Id },
                new { message = "Categoría creada con éxito." }
             );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProveedor(int id, [FromBody] ProveedorDtoReq proveedorDtoReq)
        {
            var proveedor = await proveedorRepository.ObtenerProveedorPorId(id);
            if (proveedor == null)
            {
                return BadRequest("error");
            }
            await proveedorRepository.ActualizarProveedor(mapper.Map(proveedorDtoReq, proveedor));
            return Ok(proveedor);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProveedor(int id)
        {
            var proveedor = await proveedorRepository.ObtenerProveedorPorId(id);
            if (proveedor == null)
            {
                return BadRequest("Proveedor no encontrado");
            }
            await proveedorRepository.EliminarProveedor(id);
            //return NoContent();
            return Ok(new { message = "Categoría eliminada con éxito." });
        }

    }
}
*/