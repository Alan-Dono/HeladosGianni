using ApplicationLayer.Helper;
using System;
using System.Threading.Tasks;
using WSFE;


namespace ApplicationLayer.Services
{
    public class WSFEService
    {
        private readonly string CUIT;
        private readonly int PUNTO_VENTA;
        private readonly AfipService afipService;
        private TokenResult Credenciales;

        public WSFEService(string cuit, int puntoVenta, AfipService afipService )
        {
            CUIT = cuit;
            PUNTO_VENTA = puntoVenta;
            this.afipService = afipService;
        }

        private async Task ObtenerCredenciales()
        {
            Credenciales = await afipService.ObtenerCredenciales();
        }

        public async Task<FacturaResponse> GenerarFacturaConsumidorFinal(decimal montoTotal, string concepto = "Productos")
        {
            await ObtenerCredenciales();
            try
            {
                // 1. Preparar autenticación
                var auth = new FEAuthRequest
                {
                    Token = Credenciales.Token,
                    Sign = Credenciales.Sign,
                    Cuit = long.Parse(CUIT)
                };

                // 2. Crear cabecera
                var cabecera = new FECAECabRequest
                {
                    CantReg = 1,
                    PtoVta = PUNTO_VENTA,
                    CbteTipo = 6 // 6 = Factura B (consumidor final)
                };

                // 3. Obtener último número de comprobante
                var ultimoComprobante = await ObtenerUltimoComprobante(auth, 6);
                var numeroComprobante = ultimoComprobante + 1;

                // 4. Calcular importes
                var importeNeto = Math.Round(montoTotal / 1.21m, 2); // Separar IVA 21%
                var importeIva = Math.Round(montoTotal - importeNeto, 2);

                // 5. Crear detalle del comprobante
                var detalle = new FECAEDetRequest
                {
                    Concepto = 1, // 1 = Productos
                    DocTipo = 99, // Consumidor Final
                    DocNro = 0, // Consumidor Final no requiere documento
                    CbteDesde = numeroComprobante,
                    CbteHasta = numeroComprobante,
                    CbteFch = DateTime.Now.ToString("yyyyMMdd"),
                    ImpTotal = (double)montoTotal,
                    ImpTotConc = 0, // Importe neto no gravado
                    ImpNeto = (double)importeNeto,
                    ImpOpEx = 0, // Importe exento
                    ImpTrib = 0, // Otros tributos
                    ImpIVA = (double)importeIva,
                    MonId = "PES", // Pesos Argentinos
                    MonCotiz = 1 // Cotización 1:1 para pesos
                };

                // 6. Agregar IVA 21%
                var iva = new AlicIva
                {
                    Id = 5, // 5 = 21%
                    BaseImp = (double)importeNeto,
                    Importe = (double)importeIva
                };
                detalle.Iva = new[] { iva };

                // 7. Crear request completo
                var request = new FECAERequest
                {
                    FeCabReq = cabecera,
                    FeDetReq = new[] { detalle }
                };

                // 8. Enviar solicitud a AFIP
                using (var client = new ServiceSoapClient(ServiceSoapClient.EndpointConfiguration.ServiceSoap))
                {
                    var response = await client.FECAESolicitarAsync(auth, request);
                    var resultado = response.Body.FECAESolicitarResult;

                    if (resultado.FeCabResp.Resultado == "A") // Aprobado
                    {
                        var detalleResp = resultado.FeDetResp[0];
                        // Generar datos para QR
                        var qrData = GenerarDatosQR(detalleResp.CAE, detalleResp.CAEFchVto, numeroComprobante, montoTotal);

                        return new FacturaResponse
                        {
                            Exitoso = true,
                            CAE = detalleResp.CAE,
                            VencimientoCAE = detalleResp.CAEFchVto,
                            NumeroComprobante = numeroComprobante,
                            ImporteTotal = montoTotal,
                            ImporteNeto = importeNeto,
                            ImporteIVA = importeIva,
                            FechaEmision = DateTime.Now,
                            DatosQR = qrData
                        };
                    }
                    else
                    {
                        return new FacturaResponse
                        {
                            Exitoso = false,
                            Error = resultado.Errors[0].Msg
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                return new FacturaResponse
                {
                    Exitoso = false,
                    Error = $"Error al generar factura: {ex.Message}"
                };
            }
        }

        private string GenerarDatosQR(string cae, string fechaVencimiento, long numeroComprobante, decimal montoTotal)
        {
            // Crear objeto con datos según especificación AFIP
            var qrData = new
            {
                ver = 1,
                fecha = DateTime.Now.ToString("yyyy-MM-dd"),
                cuit = CUIT,
                ptoVta = PUNTO_VENTA,
                tipoCmp = 6,
                nroCmp = numeroComprobante,
                importe = montoTotal,
                moneda = "PES",
                ctz = 1,
                tipoDocRec = 99,
                nroDocRec = 0,
                tipoCodAut = "E",
                codAut = cae
            };

            // Convertir a JSON y codificar en Base64
            var json = System.Text.Json.JsonSerializer.Serialize(qrData);
            var bytesJson = System.Text.Encoding.UTF8.GetBytes(json);
            return Convert.ToBase64String(bytesJson);
        }

        private async Task<int> ObtenerUltimoComprobante(FEAuthRequest auth, int tipoComprobante)
        {
            using (var client = new ServiceSoapClient(ServiceSoapClient.EndpointConfiguration.ServiceSoap))
            {
                var response = await client.FECompUltimoAutorizadoAsync(
                    auth,
                    PUNTO_VENTA,
                    tipoComprobante
                );
                return response.Body.FECompUltimoAutorizadoResult.CbteNro;
            }
        }
    }

    public class FacturaResponse
    {
        public bool Exitoso { get; set; }
        public string Error { get; set; }
        public string CAE { get; set; }
        public string VencimientoCAE { get; set; }
        public long NumeroComprobante { get; set; }
        public decimal ImporteTotal { get; set; }
        public decimal ImporteNeto { get; set; }
        public decimal ImporteIVA { get; set; }
        public DateTime FechaEmision { get; set; }
        public string DatosQR { get; set; }
    }

}
