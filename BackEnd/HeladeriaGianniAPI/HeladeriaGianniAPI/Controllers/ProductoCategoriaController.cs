 using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/producto/categoria")]
    public class ProductoCategoriaController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ProductoCategoriaService productoCategoriaService;

        public ProductoCategoriaController(IMapper mapper, ProductoCategoriaService productoCategoriaService)
        {
            this.mapper = mapper;
            this.productoCategoriaService = productoCategoriaService;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerCategorias()
        {
            var categorias = await productoCategoriaService.ObtenerCategorias();
            if (categorias == null)
            {
                return NotFound("No se encontraro Categorias");
            }
            var categoriasDto = mapper.Map<IEnumerable<ProductoCategoriaDtoRes>>(categorias);
            return Ok(categoriasDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerCategoriaPorId(int id)
        {
            var categoria = await productoCategoriaService.ObtenerCategoriaPorId(id);
            if (categoria == null)
            {
                return NotFound("Categoria no encontrada");
            }
            return Ok(mapper.Map<ProductoCategoriaDtoRes>(categoria));
        }

        [HttpPost]
        public async Task<IActionResult> CrearCategoriaProducto([FromBody] ProductoCategoriaDtoReq productoCategoriaDtoReq)
        {
            try
            {
                var categoria = mapper.Map<ProductoCategoria>(productoCategoriaDtoReq);
                await productoCategoriaService.AgregarCategoria(categoria);

                return CreatedAtAction(nameof(ObtenerCategoriaPorId),
                    new { id = categoria.Id },
                    new { message = "Categoría creada con éxito." });
            }
            catch (Exception ex)
            {
                if (ex.Message == "La categoria ya existe")
                {
                    return Conflict(new { message = "El nombre de la categoría ya existe." });
                }
                return StatusCode(500, new { message = "Error al crear la categoría." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCategoria(int id, [FromBody] ProductoCategoriaDtoReq productoCategoriaDtoReq)
        {
            try
            {
                var categoria = await productoCategoriaService.ObtenerCategoriaPorId(id);
                if (categoria == null)
                {
                    return BadRequest("Los Ids no coinciden");
                }
                await productoCategoriaService.ActualizarCategoria(mapper.Map(productoCategoriaDtoReq, categoria));
                return Ok(categoria);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCategoria(int id)
        {
            try
            {
                var categoria = await productoCategoriaService.ObtenerCategoriaPorId(id);
                if (categoria == null)
                {
                    return BadRequest("Categoria no encontrada");
                }
                await productoCategoriaService.EliminarCategoria(id);
                //return NoContent();
                return Ok(new { message = "Categoría eliminada con éxito." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


    }
}