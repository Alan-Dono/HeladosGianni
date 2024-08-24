using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/productos")]
    public class ProductoController : ControllerBase
    {
        private readonly ProductoService productoService;
        private readonly IMapper mapper;

        public ProductoController(ProductoService productoService, IMapper mapper)
        {
            this.productoService = productoService;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDtoRes>>> ObtenerProductos()
        {
            try
            {
                var productos = await productoService.ObtenerProductos();
                if (productos != null && productos.Any())
                {
                    var productosDto = mapper.Map<IEnumerable<ProductoDtoRes>>(productos);
                    return Ok(productosDto);
                }
                return NotFound("No se encontraron productos.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDtoRes>> ObtenerProductoPorId(int id)
        {
            try
            {
                var productoDto = await productoService.ObtenerProductosPorId(id);
                return Ok(productoDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductoCreacionDto>> CrearProducto([FromBody] ProductoCreacionDto productoDto)
        {
            try
            {
                // Mapear el DTO a la entidad Producto
                var producto = mapper.Map<Producto>(productoDto);

                // Agregar el producto a la base de datos
                await productoService.AgregarProducto(producto);

                // Mapear la entidad Producto de nuevo al DTO para devolver la respuesta
                var productoCreadoDto = mapper.Map<ProductoCreacionDto>(producto);

                // Devolver una respuesta 201 Created con la ubicación del nuevo recurso
                return CreatedAtAction(nameof(ObtenerProductoPorId), new { id = producto.Id }, productoCreadoDto);
            }
            catch (Exception ex)
            {
                // Devolver un BadRequest si ocurre una excepción
                return BadRequest(ex.Message);
            }
        }





    }
}
