using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Microsoft.IdentityModel.Tokens;

namespace ApplicationLayer.Helper
{
    public class LoginTicket
    {
        // Valores por defecto, globales en esta clase
        const string url = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL";
        const string servicio = "wsfe";
        const string certificado = "C:\\inetpub\\wwwroot\\deploy\\certificados\\certificado.pfx";
        string plainPassword = "12345678";


        public UInt32 UniqueId; // Entero de 32 bits sin signo que identifica el requerimiento
        public DateTime GenerationTime; // Momento en que fue generado el requerimiento
        public DateTime ExpirationTime; // Momento en el que expira la solicitud
        public string Service; // Identificacion del WSN para el cual se solicita el TA
        public string Sign; // Firma de seguridad recibida en la respuesta
        public string Token; // Token de seguridad recibido en la respuesta
        public XmlDocument XmlLoginTicketRequest = null;
        public XmlDocument XmlLoginTicketResponse = null;
        public string RutaDelCertificadoFirmante;
        public string XmlStrLoginTicketRequestTemplate = "<loginTicketRequest><header><uniqueId></uniqueId><generationTime></generationTime><expirationTime></expirationTime></header><service></service></loginTicketRequest>";
        private static UInt32 _globalUniqueID = 0; // OJO! NO ES THREAD-SAFE

        public async Task<TokenResult> ObtenerCredenciales()
        {
            var token = new TokenResult();
            var esValido = await ValidarFechaExpiracionAsync();
            if (!esValido)
            {
                await ObtenerLoginTicketResponse(servicio, url, certificado, plainPassword);
            }
            token = await ObtenerTokenYFirma();
            return token;
        }

        /// <summary>
        /// Construye un Login Ticket obtenido del WSAA
        /// </summary>
        /// <param name="argServicio">Servicio al que se desea acceder</param>
        /// <param name="argUrlWsaa">URL del WSAA</param>
        /// <param name="argRutaCertX509Firmante">Ruta del certificado X509 (con clave privada) usado para firmar</param>
        /// <param name="argPassword">Password del certificado X509 (con clave privada) usado para firmar</param>
        /// <remarks></remarks>
        public async Task<string> ObtenerLoginTicketResponse(string argServicio, string argUrlWsaa, string argRutaCertX509Firmante, string argPassword)
        {
            const string ID_FNC = "[ObtenerLoginTicketResponse]";
            this.RutaDelCertificadoFirmante = argRutaCertX509Firmante;
            string cmsFirmadoBase64 = null;
            string loginTicketResponse = null;
            XmlNode xmlNodoUniqueId = default(XmlNode);
            XmlNode xmlNodoGenerationTime = default(XmlNode);
            XmlNode xmlNodoExpirationTime = default(XmlNode);
            XmlNode xmlNodoService = default(XmlNode);

            // PASO 1: Genero el Login Ticket Request
            try
            {
                _globalUniqueID += 1;

                XmlLoginTicketRequest = new XmlDocument();
                XmlLoginTicketRequest.LoadXml(XmlStrLoginTicketRequestTemplate);

                xmlNodoUniqueId = XmlLoginTicketRequest.SelectSingleNode("//uniqueId");
                xmlNodoGenerationTime = XmlLoginTicketRequest.SelectSingleNode("//generationTime");
                xmlNodoExpirationTime = XmlLoginTicketRequest.SelectSingleNode("//expirationTime");
                xmlNodoService = XmlLoginTicketRequest.SelectSingleNode("//service");
                xmlNodoGenerationTime.InnerText = DateTime.Now.AddMinutes(-10).ToString("s");
                xmlNodoExpirationTime.InnerText = DateTime.Now.AddMinutes(+10).ToString("s");
                xmlNodoUniqueId.InnerText = Convert.ToString(_globalUniqueID);
                xmlNodoService.InnerText = argServicio;
                this.Service = argServicio;

                // Ruta donde guardarás el archivo
                string rutaArchivo = @"C:\inetpub\wwwroot\deploy\certificados\LoginTicketRequest.xml";
                // Guardar el archivo XML
                XmlLoginTicketRequest.Save(rutaArchivo);
            }
            catch (Exception excepcionAlGenerarLoginTicketRequest)
            {
                throw new Exception(ID_FNC + "***Error GENERANDO el LoginTicketRequest : " + excepcionAlGenerarLoginTicketRequest.Message + excepcionAlGenerarLoginTicketRequest.StackTrace);
            }

            // PASO 2: Firmo el Login Ticket Request
            try
            {
                X509Certificate2 certFirmante = CertificadosX509Lib.ObtieneCertificadoDesdeArchivo(RutaDelCertificadoFirmante, argPassword);

                // Convierto el Login Ticket Request a bytes, firmo el msg y lo convierto a Base64
                Encoding EncodedMsg = Encoding.UTF8;
                byte[] msgBytes = EncodedMsg.GetBytes(XmlLoginTicketRequest.OuterXml);
                byte[] encodedSignedCms = CertificadosX509Lib.FirmaBytesMensaje(msgBytes, certFirmante);
                cmsFirmadoBase64 = Convert.ToBase64String(encodedSignedCms);

                // Ruta donde guardarás el archivo firmado
                string rutaArchivoFirmado = @"C:\inetpub\wwwroot\deploy\certificados\LoginTicketRequestFirmado.txt";
                // Escribir el contenido firmado (Base64) en un archivo
                File.WriteAllText(rutaArchivoFirmado, cmsFirmadoBase64);
            }
            catch (Exception excepcionAlFirmar)
            {
                throw new Exception(ID_FNC + "***Error FIRMANDO el LoginTicketRequest : " + excepcionAlFirmar.Message);
            }

            // PASO 3: Invoco al WSAA para obtener el Login Ticket Response
            try
            {
                WSAA.LoginCMSClient servicioWsaa = new WSAA.LoginCMSClient();
                // ClienteLoginCms_CS.Wsaa.LoginCMSService servicioWsaa = new ClienteLoginCms_CS.Wsaa.LoginCMSService();
                servicioWsaa.Endpoint.Address = new System.ServiceModel.EndpointAddress(argUrlWsaa);

                // Llamar al método async
                var response = await servicioWsaa.loginCmsAsync(cmsFirmadoBase64);

                // Procesar la respuesta
                string ticketAcceso = response.loginCmsReturn;

                loginTicketResponse = ticketAcceso;

            }
            catch (Exception excepcionAlInvocarWsaa)
            {
                throw new Exception(ID_FNC + "***Error INVOCANDO al servicio WSAA : " + excepcionAlInvocarWsaa.Message);
            }

            // PASO 4: Analizo el Login Ticket Response recibido del WSAA
            try
            {
                XmlLoginTicketResponse = new XmlDocument();
                XmlLoginTicketResponse.LoadXml(loginTicketResponse);
                this.UniqueId = UInt32.Parse(XmlLoginTicketResponse.SelectSingleNode("//uniqueId").InnerText);
                this.GenerationTime = DateTime.Parse(XmlLoginTicketResponse.SelectSingleNode("//generationTime").InnerText);
                this.ExpirationTime = DateTime.Parse(XmlLoginTicketResponse.SelectSingleNode("//expirationTime").InnerText);
                this.Sign = XmlLoginTicketResponse.SelectSingleNode("//sign").InnerText;
                this.Token = XmlLoginTicketResponse.SelectSingleNode("//token").InnerText;

                // Ruta para guardar el Login Ticket Response
                string rutaArchivoResponse = @"C:\inetpub\wwwroot\deploy\certificados\LoginTicketResponse.xml";
                // Guardar el contenido completo del XML en un archivo
                XmlLoginTicketResponse.Save(rutaArchivoResponse);

            }
            catch (Exception excepcionAlAnalizarLoginTicketResponse)
            {
                throw new Exception(ID_FNC + "***Error ANALIZANDO el LoginTicketResponse : " + excepcionAlAnalizarLoginTicketResponse.Message);
            }
            return loginTicketResponse;
        }


        public async Task<TokenResult> ObtenerTokenYFirma()
        {

            try
            {
                string rutaArchivoResponse = @"C:\inetpub\wwwroot\deploy\certificados\LoginTicketResponse.xml";

                // Verificar si el archivo existe
                if (!File.Exists(rutaArchivoResponse))
                    return null; // O manejarlo según tus necesidades

                // Cargar el archivo XML de forma asincrónica
                XmlDocument xmlDocument = new XmlDocument();
                using (var reader = File.OpenText(rutaArchivoResponse))
                {
                    string contenido = await reader.ReadToEndAsync();
                    xmlDocument.LoadXml(contenido);
                }

                // Extraer el token y la firma
                var token = xmlDocument.SelectSingleNode("//token")?.InnerText;
                var signature = xmlDocument.SelectSingleNode("//sign")?.InnerText;

                // Validar que los valores existan antes de crear el objeto
                if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(signature))
                    return null; // Manejar el caso donde no se encuentren los datos esperados

                // Devolver el resultado como un TokenResult
                return new TokenResult
                {
                    Token = token,
                    Sign = signature
                };
            }
            catch (Exception)
            {
                // Manejar posibles errores y devolver null o lanzar una excepción personalizada
                return null;
            }
        }

        public async Task<bool> ValidarFechaExpiracionAsync()
        {
            try
            {
                string rutaArchivoResponse = @"C:\inetpub\wwwroot\deploy\certificados\LoginTicketResponse.xml";

                // Verificar si el archivo existe
                if (!File.Exists(rutaArchivoResponse))
                    return false;

                // Cargar el archivo XML de forma asincrónica
                XmlDocument xmlDocument = new XmlDocument();
                using (var reader = File.OpenText(rutaArchivoResponse))
                {
                    string contenido = await reader.ReadToEndAsync();
                    xmlDocument.LoadXml(contenido);
                }

                // Extraer la fecha de expiración
                var expirationNode = xmlDocument.SelectSingleNode("//expirationTime");
                if (expirationNode == null || !DateTime.TryParse(expirationNode.InnerText, out DateTime expirationTime))
                    return false;

                // Validar si la fecha de expiración es mayor a la fecha actual
                return expirationTime > DateTime.UtcNow;
            }
            catch (Exception)
            {
                // Manejar errores en la validación
                return false;
            }
        }





    }
}
