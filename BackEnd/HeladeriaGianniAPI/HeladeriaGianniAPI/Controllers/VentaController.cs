using ApplicationLayer.Services;
using AutoMapper;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{
    [ApiController]
    [Route("api/ventas")]
    public class VentaController : ControllerBase
    {
        private readonly VentaService ventaService;
        private readonly IMapper mapper;

        public VentaController(VentaService ventaService, IMapper mapper)
        {
            this.ventaService = ventaService;
            this.mapper = mapper;
        }

/*        [HttpGet]
        public async Task<ActionResult<ICollection<VentaDtoRes>>> ObtenerVentas()
        {
            var ventas = await ventaService.ObtenerVentas();
            if (ventas == null)
            {
                return BadRequest("No se encontraron ventas");
            }
            var ventasDtos = mapper.Map<>
        }*/
        
    }
}
