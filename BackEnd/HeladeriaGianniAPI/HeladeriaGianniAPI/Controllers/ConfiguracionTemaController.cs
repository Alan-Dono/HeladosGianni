using ApplicationLayer.Services;
using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/configuraciontema")]
public class ConfiguracionTemaController : ControllerBase
{
    private readonly ConfiguracionTemaService _configuracionTemaService;
    private readonly IMapper _mapper;

    public ConfiguracionTemaController(ConfiguracionTemaService configuracionTemaService, IMapper mapper)
    {
        _configuracionTemaService = configuracionTemaService;
        _mapper = mapper;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ConfiguracionTemaDtoRes>> GetConfiguracionTema(int id)
    {
        try
        {
            var configuracion = await _configuracionTemaService.GetConfiguracionTemaAsync(id);
            if (configuracion == null) return NotFound();

            var configuracionDto = _mapper.Map<ConfiguracionTemaDtoRes>(configuracion);
            return Ok(configuracionDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("usuario/{usuarioId}")]
    public async Task<ActionResult<ConfiguracionTemaDtoRes>> GetConfiguracionTemaByUsuario(int usuarioId)
    {
        try
        {
            var configuracion = await _configuracionTemaService.GetConfiguracionTemaByUsuarioAsync(usuarioId);
            if (configuracion == null) return NotFound();

            var configuracionDto = _mapper.Map<ConfiguracionTemaDtoRes>(configuracion);
            return Ok(configuracionDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("default")]
    public async Task<ActionResult<ConfiguracionTemaDtoRes>> GetDefaultConfiguracionTema()
    {
        try
        {
            Console.WriteLine("Solicitando configuración de tema por defecto...");

            var configuracion = await _configuracionTemaService.GetDefaultConfiguracionTemaAsync();

            if (configuracion == null)
            {
                Console.WriteLine("No se encontró configuración por defecto");
                return NotFound();
            }

            Console.WriteLine($"Configuración encontrada: {configuracion.Id}");

            var configuracionDto = _mapper.Map<ConfiguracionTemaDtoRes>(configuracion);
            return Ok(configuracionDto);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en GetDefaultConfiguracionTema: {ex.Message}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<ConfiguracionTemaDtoRes>> CreateConfiguracionTema([FromBody] ConfiguracionTemaCreacionDtoReq crearDto)
    {
        try
        {
            var configuracion = _mapper.Map<ConfiguracionTema>(crearDto);
            var created = await _configuracionTemaService.CreateConfiguracionTemaAsync(configuracion);

            var configuracionDto = _mapper.Map<ConfiguracionTemaDtoRes>(created);
            return CreatedAtAction(nameof(GetConfiguracionTema), new { id = created.Id }, configuracionDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ConfiguracionTemaDtoRes>> UpdateConfiguracionTema(int id, [FromBody] ConfiguracionTemaActualizacionDtoReq actualizarDto)
    {
        try
        {
            var configuracion = _mapper.Map<ConfiguracionTema>(actualizarDto);
            var updated = await _configuracionTemaService.UpdateConfiguracionTemaAsync(id, configuracion);

            if (updated == null) return NotFound();

            var configuracionDto = _mapper.Map<ConfiguracionTemaDtoRes>(updated);
            return Ok(configuracionDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConfiguracionTema(int id)
    {
        try
        {
            var result = await _configuracionTemaService.DeleteConfiguracionTemaAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}