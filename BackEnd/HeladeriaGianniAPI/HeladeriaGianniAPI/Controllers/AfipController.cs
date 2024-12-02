
using ApplicationLayer.Services;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaGianniAPI.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AfipController : ControllerBase
    {
        private readonly AfipService afipService;
        private readonly WSFEService wSFEService;

        public AfipController(AfipService afipService, WSFEService wSFEService)
        {
            this.afipService = afipService;
            this.wSFEService = wSFEService;
        }

        [HttpGet("SolicitarNuevoToken")]
        public async Task<IActionResult> GetLoginTicket()
        {
            try
            {
                var loginTicket = await afipService.ObtenerNuevoTokenYfirma();
                return Ok(loginTicket);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("ObtenerTokenYFirma")]
        public async Task<IActionResult> ObtenerTokenYFirma()
        {
            try
            {
                var esValido = await afipService.ObtenerTokenYFirma();
                return Ok(esValido); // Devuelve el token y la firma como una respuesta 200 OK
            }
            catch (Exception ex)
            {
                // Manejo de excepciones en caso de error
                return StatusCode(500, $"Ocurrió un error: {ex.Message}");
            }
        }

        [HttpGet("validar-expiracion")]
        public async Task<IActionResult> ValidarExpiracion()
        {
            var esValido = await afipService.ValidarExpiracion();
            return Ok(esValido);
        }

        [HttpGet("GenerarFactura")]
        public async Task<IActionResult> GenerarFactura([FromQuery] decimal montoTotal)
        {
            try
            {
                var factura = await wSFEService.GenerarFacturaConsumidorFinal(montoTotal);

                if (factura.Exitoso)
                {
                    return Ok(factura);
                }

                return BadRequest(factura.Error);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocurrió un error: {ex.Message}");
            }
        }

    }

}
