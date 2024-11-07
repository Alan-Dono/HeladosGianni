using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;
using System.Data;

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

        [HttpGet("{id}", Name = "ObtenerProductoPorId")]
        public async Task<ActionResult<ProductoDtoRes>> ObtenerProductoPorId(int id)
        {
            try
            {
                var producto = await productoService.ObtenerProductosPorId(id);
                var productoDto = mapper.Map<ProductoDtoRes>(producto);
                return Ok(productoDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductoDtoRes>> CrearProducto([FromBody] ProductoCreacionDtoReq productoCreacionDto)
        {
            try
            {
                // Mapear el DTO a la entidad Producto
                var producto = mapper.Map<Producto>(productoCreacionDto);

                // Agregar el producto a la base de datos
                await productoService.AgregarProducto(producto);

                // Recargar el producto desde la base de datos para incluir las relaciones
                producto = await productoService.ObtenerProductosPorId(producto.Id);

                // Mapear la entidad Producto de nuevo al DTO para devolver la respuesta
                var productoCreadoDto = mapper.Map<ProductoDtoRes>(producto);

                // Devolver una respuesta 201 Created con la ubicación del nuevo recurso
                return CreatedAtAction(nameof(ObtenerProductoPorId), new { id = producto.Id }, productoCreadoDto);
            }
            catch (Exception ex)
            {
                // Devolver un BadRequest si ocurre una excepción
                return BadRequest(ex.Message);
            }
        }



        [HttpPut("{id}")]
        public async Task<ActionResult<ProductoDtoRes>> ActualizarProducto(int id , [FromBody] ProductoCreacionDtoReq productoActualizarDto)
        {
            try
            {
                // Mapear el DTO a la entidad Producto
                var producto = mapper.Map<Producto>(productoActualizarDto);

                // Pasar a la capa de aplicación para editar el producto
                await productoService.EditarProducto(id, producto);

                // Obtener el producto actualizado y mapearlo a DTO de respuesta
                var productoActualizado = await productoService.ObtenerProductosPorId(id);
                var productoResDto = mapper.Map<ProductoDtoRes>(productoActualizado);

                return Ok(productoResDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarProducto(int id)
        {
            try
            {
                await productoService.EliminarProducto(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("categoria/{id}", Name = "ObtenerProductosPorCategoria")]
        public async Task<ActionResult<IEnumerable<ProductoDtoRes>>> ObtenerProductosPorCategoria(int id)
        {
            try
            {
                var productosCategorias = await productoService.ObtenerProductosPorCategoria(id);
                if (productosCategorias != null && productosCategorias.Any())
                {
                    var productosDto = mapper.Map<IEnumerable<ProductoDtoRes>>(productosCategorias);
                    return Ok(productosDto);
                }
                return NotFound("No se encontraron productos.");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost("{id}/favorito", Name = "AgregarAFavoritos")]
        public async Task<IActionResult> AgregarAFavoritos(int id)
        {
            try
            {
                await productoService.AgregarAFavorito(id);
                return Ok(new { mensaje = "Producto agregado a favoritos" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Error al agregar a favoritos");
            }
        }

        [HttpDelete("{id}/favorito", Name = "EliminarDeFavoritos")]
        public async Task<IActionResult> EliminarDeFavoritos(int id)
        {
            try
            {
                await productoService.EliminarDeFavorito(id);
                return Ok(new { mensaje = "Producto eliminado de favoritos" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Error al eliminar de favoritos");
            }
        }

        [HttpGet("favoritos", Name = "ObtenerFavoritos")]
        public async Task<ActionResult<List<ProductoDtoRes>>> ObtenerFavoritos()
        {
            var favoritos = await productoService.ObtenerFavoritos();
            if (favoritos == null)
            {
                return NotFound("No hay productos marcados como favoritos.");
            }
            var productosDto = mapper.Map<IEnumerable<ProductoDtoRes>>(favoritos);
            return Ok(productosDto);
        }


    }
}
