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
    [Route("api/ventas")]
    public class VentaController : ControllerBase
    {
        private readonly VentaService _ventaService;
        private readonly IMapper _mapper;
        private readonly ImpresoraTicketService impresoraTicketService;

        public VentaController(VentaService ventaService, IMapper mapper, ImpresoraTicketService impresoraTicketService)
        {
            _ventaService = ventaService;
            _mapper = mapper;
            this.impresoraTicketService = impresoraTicketService;
        }

        // Obtener todas las ventas
        [HttpGet]
        public async Task<IActionResult> ObtenerVentas()
        {
            var ventas = await _ventaService.ObtenerVentas();
            var ventasDto = _mapper.Map<ICollection<VentaDtoRes>>(ventas);
            return Ok(ventasDto);
        }

        // Obtener venta por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerVentasPorId(int id)
        {
            var venta = await _ventaService.ObtenerVentaPorId(id);
            if (venta == null)
                return NotFound();

            var ventaDto = _mapper.Map<VentaProductosDtoRes>(venta);
            return Ok(ventaDto);
        }

        // Obtener ventas entre fechas
        [HttpGet("entre-fechas")]
        public async Task<IActionResult> ObtenerVentasEntreFechas(DateTime desde, DateTime hasta)
        {
            var ventas = await _ventaService.ObtenerVentasEntreFechas(desde, hasta);
            var ventasDto = _mapper.Map<IEnumerable<VentaDtoRes>>(ventas);
            return Ok(ventasDto);
        }

        [HttpGet("cierres/{id}")]
        public async Task<IActionResult> ObtenerVentasPorCierreCaja(int id)
        {
            var ventas = await _ventaService.ObtenerPorCierreCaja(id);
            var ventasDto = _mapper.Map<IEnumerable<VentaDtoRes>>(ventas);
            return Ok(ventasDto);
        }

        // Crear una nueva venta normal
        [HttpPost("crear-venta-normal", Name = "CrearVentaNormal")]
        public async Task<ActionResult<VentaDtoRes>> CrearVentaNormal([FromBody] VentaDtoReq ventaDtoReq)
        {
            var venta = _mapper.Map<Venta>(ventaDtoReq);

            // Mapeo seguro de conceptos varios
            if (ventaDtoReq.ConceptosVarios != null && ventaDtoReq.ConceptosVarios.Any())
            {
                venta.ConceptosVarios = _mapper.Map<List<ConceptoVarios>>(ventaDtoReq.ConceptosVarios);
            }

            await _ventaService.RegistrarVenta(venta);
            venta = await _ventaService.ObtenerVentaPorId(venta.Id);

            impresoraTicketService.ImprimirTicketVenta(venta,
                ventaDtoReq.AclaracionCafeteria,
                ventaDtoReq.AclaracionHeladeria);

            var ventaDto = _mapper.Map<VentaDtoRes>(venta);
            return CreatedAtAction(nameof(ObtenerVentasPorId), new { id = venta.Id }, ventaDto);
        }

        /*[HttpPost("crear-venta-normal", Name = "CrearVentaNormal")]
        public async Task<ActionResult<VentaDtoRes>> CrearVentaNormal([FromBody] VentaDtoReq ventaDtoReq)
        {
            // aca quedaste recorda seguir la venta
            string? notaCafe = ventaDtoReq.AclaracionCafeteria;
            string? notaHelado = ventaDtoReq.AclaracionHeladeria;
            var venta = _mapper.Map<Venta>(ventaDtoReq);
            // Mapeo seguro de conceptos varios (puede ser null)
            if (ventaDtoReq.ConceptosVarios != null)
            {
                venta.ConceptosVarios = _mapper.Map<List<ConceptoVarios>>(ventaDtoReq.ConceptosVarios);
            }
            await _ventaService.RegistrarVenta(venta);
            venta = await _ventaService.ObtenerVentaPorId(venta.Id);
            impresoraTicketService.ImprimirTicketVenta(venta, ventaDtoReq.AclaracionCafeteria, ventaDtoReq.AclaracionHeladeria);
            var ventaDto = _mapper.Map<VentaDtoRes>(venta);
            return CreatedAtAction(nameof(ObtenerVentasPorId), new { id = venta.Id }, ventaDto);
        }*/

        // Crear una nueva venta fiscal
        [HttpPost("crear-venta-fiscal", Name = "CrearVentaFiscal")]
        public async Task<ActionResult<VentaDtoRes>> CrearVentaFiscal([FromBody] VentaDtoReq ventaDtoReq)
        {
            string? notaCafe = ventaDtoReq.AclaracionCafeteria;
            string? notaHelado = ventaDtoReq.AclaracionHeladeria;
            var venta = _mapper.Map<Venta>(ventaDtoReq);
            await _ventaService.RegistrarVenta(venta);
            venta = await _ventaService.ObtenerVentaPorId(venta.Id);
            impresoraTicketService.ImprimirTicketVentaFiscal(venta, ventaDtoReq.AclaracionCafeteria, ventaDtoReq.AclaracionHeladeria);
            var ventaDto = _mapper.Map<VentaDtoRes>(venta);
            return CreatedAtAction(nameof(ObtenerVentasPorId), new { id = venta.Id }, ventaDto);
        }


        // Eliminar una venta
        [HttpPut("{id}")]
        public async Task<IActionResult> AnularVenta(int id)
        {
            await _ventaService.AnularVenta(id);
            return NoContent();
        }

        [HttpPost("cambiar-modo-impresion/{modo:int}")]
        public IActionResult CambiarModoImpresion(int modo)
        {
            impresoraTicketService.CambiarModoImpresion(modo);
            return Ok();
        }

        // Agrega este método al VentaController
        [HttpGet("modo-impresion")]
        public IActionResult ObtenerModoImpresion()
        {
            try
            {
                // Asumo que tienes acceso al servicio de impresión desde el controlador
                var modo = impresoraTicketService.ObtenerModoImpresion();
                return Ok(new { modo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el modo de impresión: {ex.Message}");
            }
        }
    }
}
