using ApplicationLayer.Helper;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Cms;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.X509.Store;
using System.Security;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.Xml.Linq;
using System.Xml.Schema;

namespace ApplicationLayer.Services
{
    public class AfipService
    {
        private readonly IConfiguration configuration;
        private readonly LoginTicket loginTicket;
        string plainPassword = "12345678";

        // Valores por defecto, globales en esta clase
        const string url = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL";
        const string servicio = "wsfe";
        const string certificado = "C:\\www\\HELADERIA-GIANNI\\AfipTest\\certificado.pfx";


       

        public AfipService(IConfiguration configuration, LoginTicket loginTicket)
        {
            this.configuration = configuration;
            this.loginTicket = loginTicket;
        }

        public async Task<TokenResult> ObtenerCredenciales()
        {
            return await loginTicket.ObtenerCredenciales(); 
        }

        /// <summary>
        /// Metodo para testear
        /// </summary>
        /// <returns></returns>
        public async Task<string> ObtenerNuevoTokenYfirma() // Solicitud a WSAA de AFIP
        {
            return await loginTicket.ObtenerLoginTicketResponse(servicio, url,certificado, plainPassword );
        }
        /// <summary>
        /// Metodo para testear
        /// </summary>
        /// <returns></returns>
        public async Task<TokenResult> ObtenerTokenYFirma() // Lee y valida el tiket response del archivo local. Devuelve token y sign
        {
            return await loginTicket.ObtenerTokenYFirma();
        }
        /// <summary>
        /// Metodo para testear
        /// </summary>
        /// <returns></returns>
        public async Task<bool> ValidarExpiracion() // Valida la fechan de expiracion devuelve true o false
        {
            return await loginTicket.ValidarFechaExpiracionAsync();
        }
    }
}
