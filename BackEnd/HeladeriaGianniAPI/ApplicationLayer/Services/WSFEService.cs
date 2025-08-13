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

        // 1. Método actualizado para AFIP según RG 5616
        public async Task<FacturaResponse> GenerarFacturaConsumidorFinal(decimal montoTotal, string concepto = "Productos")
        {
            await ObtenerCredenciales();
            try
            {
                var auth = new FEAuthRequest
                {
                    Token = Credenciales.Token,
                    Sign = Credenciales.Sign,
                    Cuit = long.Parse(CUIT)
                };

                var cabecera = new FECAECabRequest
                {
                    CantReg = 1,
                    PtoVta = PUNTO_VENTA,
                    CbteTipo = 6 // factura b
                };

                var ultimoComprobante = await ObtenerUltimoComprobante(auth, 6);
                var numeroComprobante = ultimoComprobante + 1;

                var importeNeto = Math.Round(montoTotal / 1.21m, 2);
                var importeIva = Math.Round(montoTotal - importeNeto, 2);

                // Validación de redondeo
                if (Math.Abs((importeNeto + importeIva) - montoTotal) > 0.01m)
                {
                    throw new Exception("Error en cálculo de importes: la suma de neto + IVA no coincide con el total");
                }


                var detalle = new FECAEDetRequest
                {
                    Concepto = 1, // Productos
                    DocTipo = 99, // Consumidor Final
                    DocNro = 0, // Cero obligatorio para CF
                    CondicionIVAReceptorId = 5, // Consumidor Final
                    CbteDesde = numeroComprobante,
                    CbteHasta = numeroComprobante,
                    CbteFch = DateTime.Now.ToString("yyyyMMdd"),
                    ImpTotal = (double)montoTotal,
                    ImpTotConc = 0,
                    ImpNeto = (double)importeNeto,
                    ImpOpEx = 0,
                    ImpTrib = 0,
                    ImpIVA = (double)importeIva,
                    MonId = "PES",
                    MonCotiz = 1,
                    Iva = new[]
                {
                    new AlicIva
                    {
                        Id = 5, // 21%
                        BaseImp = (double)importeNeto,
                        Importe = (double)importeIva
                    }
                }
                            };

                var request = new FECAERequest
                {
                    FeCabReq = cabecera,
                    FeDetReq = new[] { detalle }
                };

                // Log mejorado
                Console.WriteLine("=== DETALLE DE FACTURA ===");
                Console.WriteLine($"Número: {PUNTO_VENTA}-{numeroComprobante}");
                Console.WriteLine($"Fecha: {detalle.CbteFch}");
                Console.WriteLine($"Importe Total: {montoTotal}");
                Console.WriteLine($"Neto: {importeNeto} | IVA: {importeIva}");
                Console.WriteLine($"Concepto: {concepto}");

                using (var client = new ServiceSoapClient(ServiceSoapClient.EndpointConfiguration.ServiceSoap)) // ULR PROD : ServiceSoap // URL DEV: ServiceSoap12
                {
                    Console.WriteLine($"URL: {ServiceSoapClient.EndpointConfiguration.ServiceSoap}");
                    var response = await client.FECAESolicitarAsync(auth, request);
                    var resultado = response.Body.FECAESolicitarResult;

                    if (resultado.FeCabResp.Resultado == "A")
                    {
                        var detalleResp = resultado.FeDetResp[0];
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
                        var mensajeError = "Factura rechazada";

                        if (resultado.Errors != null && resultado.Errors.Length > 0)
                        {
                            mensajeError = $"ERROR {resultado.Errors[0].Code}: {resultado.Errors[0].Msg}";
                            // Log de todos los errores
                            foreach (var error in resultado.Errors)
                            {
                                Console.WriteLine($"ERROR AFIP: {error.Code} - {error.Msg}");
                            }
                        }
                        else if (resultado.FeDetResp?[0]?.Observaciones != null && resultado.FeDetResp[0].Observaciones.Length > 0)
                        {
                            mensajeError = $"OBS {resultado.FeDetResp[0].Observaciones[0].Code}: {resultado.FeDetResp[0].Observaciones[0].Msg}";
                            // Log de todas las observaciones
                            foreach (var obs in resultado.FeDetResp[0].Observaciones)
                            {
                                Console.WriteLine($"OBSERVACIÓN AFIP: {obs.Code} - {obs.Msg}");
                            }
                        }

                        return new FacturaResponse
                        {
                            Exitoso = false,
                            Error = mensajeError
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPCIÓN: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"INNER EXCEPTION: {ex.InnerException.Message}");
                }
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
