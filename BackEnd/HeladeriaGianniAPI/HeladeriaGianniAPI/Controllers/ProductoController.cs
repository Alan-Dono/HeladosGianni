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
               /* // Verificar si se ha enviado una imagen
                string rutaFoto = null;
                if (productoCreacionDto.Foto != null && productoCreacionDto.Foto.Length > 0)
                {
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploadsPath))
                    {
                        Directory.CreateDirectory(uploadsPath);
                    }

                    // Crear un nombre único para el archivo
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productoCreacionDto.Foto.FileName);
                    var filePath = Path.Combine(uploadsPath, fileName);

                    // Guardar el archivo
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productoCreacionDto.Foto.CopyToAsync(stream);
                    }

                    // Guardar la ruta relativa en el producto
                    rutaFoto = $"/images/{fileName}";
                }*/

                // Mapear el DTO a la entidad Producto
                var producto = mapper.Map<Producto>(productoCreacionDto);

                // Asignar la ruta de la foto si existe
                //producto.Foto = rutaFoto;

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



    }
}
