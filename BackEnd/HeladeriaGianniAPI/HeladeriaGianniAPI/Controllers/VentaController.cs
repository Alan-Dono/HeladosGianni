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

        // Crear una nueva venta
        [HttpPost]
        public async Task<ActionResult<VentaDtoRes>> CrearVenta([FromBody] VentaDtoReq ventaDtoReq)
        {
            var venta = _mapper.Map<Venta>(ventaDtoReq);
            await _ventaService.RegistrarVenta(venta);
            venta = await _ventaService.ObtenerVentaPorId(venta.Id);
            impresoraTicketService.ImprimirTicketVenta(venta);
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
    }
}
