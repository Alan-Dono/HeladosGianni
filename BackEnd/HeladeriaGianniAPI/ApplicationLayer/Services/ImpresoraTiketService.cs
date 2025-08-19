using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Printing;
using System.IO;
using System.Net.NetworkInformation;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using ZXing;
using ZXing.Common;
using ZXing.QrCode;

namespace ApplicationLayer.Services
{   // cambiamos program.cs , ventaController, y venta service
    public class ImpresoraTicketService
    {
        private const string NOMBRE_IMPRESORA = "GianniPrinter";
        private readonly WSFEService webService;
        private Venta _ventaActual;
        private Venta _ventaHelados = new Venta();
        private Venta _ventacafeteria = new Venta();
        private Venta _ventaVarios = new Venta();
        private FacturaResponse FacturaResponse;
        private static readonly string RUTA_CONTADOR = Path.Combine(
            @"C:\Users\ALAN\Desktop\RUTAS",
            "Contador.txt");
        private static readonly string RUTA_MODO = Path.Combine(@"C:\Users\ALAN\Desktop\RUTAS",
            "ModoImpresion.txt");
        private static readonly string RUTA_COMANDA = Path.Combine(@"C:\Users\ALAN\Desktop\RUTAS",
        "Comanda.txt");
        // C:\Users\ALAN\Desktop\RUTAS
        public ImpresoraTicketService(WSFEService webService)
        {
            bool impresoraEncontrada = false;
            foreach (string printer in PrinterSettings.InstalledPrinters)
            {
                if (printer == NOMBRE_IMPRESORA)
                {
                    impresoraEncontrada = true;
                    break;
                }
            }

            if (!impresoraEncontrada)
            {
                throw new Exception($"No se encontró la impresora '{NOMBRE_IMPRESORA}'");
            }

            this.webService = webService;
        }

        public void CambiarModoImpresion(int modo)
        {
            try
            {
                // Forzar a 0 o 1
                modo = modo != 0 ? 1 : 0;
                File.WriteAllText(RUTA_MODO, modo.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al cambiar modo de impresión: {ex.Message}");
            }
        }

        public int ObtenerModoImpresion()
        {
            try
            {
                if (!File.Exists(RUTA_MODO))
                {
                    File.WriteAllText(RUTA_MODO, "0"); // Valor por defecto
                    return 0;
                }

                string contenido = File.ReadAllText(RUTA_MODO);
                return contenido.Trim() == "1" ? 1 : 0; // Solo acepta 0 o 1
            }
            catch
            {
                return 0; // Valor por defecto en caso de error
            }
        }

        public void ImprimirTicketVenta(Venta venta, string AclaracionCafeteria, string AclaracionHeladeria)
        {
            try
            {
                int modoImpresion = ObtenerModoImpresion();
                _ventaActual = venta;
                ProductosCageteria(_ventaActual);
                PrintDocument pd = new PrintDocument();
                pd.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;

                // Configurar tamaño de papel y márgenes
                foreach (PaperSize size in pd.PrinterSettings.PaperSizes)
                {
                    if (size.PaperName.Contains("80 x 3276"))
                    {
                        pd.DefaultPageSettings.PaperSize = size;
                        break;
                    }
                }
                pd.DefaultPageSettings.Margins = new Margins(5, 5, 15, 30);

                if (!pd.PrinterSettings.IsValid)
                {
                    throw new Exception($"La impresora '{NOMBRE_IMPRESORA}' no está disponible");
                }

                if (_ventacafeteria.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketCafe = new PrintDocument();
                    tiketCafe.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
                    tiketCafe.DefaultPageSettings.PaperSize = pd.DefaultPageSettings.PaperSize;
                    tiketCafe.DefaultPageSettings.Margins = pd.DefaultPageSettings.Margins;
                    tiketCafe.PrintPage += (sender, e) => ImprimirTicketProductos(_ventacafeteria.DetallesVentas, AclaracionCafeteria, e, "COMANDA N");
                    tiketCafe.Print();
                }


                if (_ventaHelados.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketHelado = new PrintDocument();
                    tiketHelado.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
                    tiketHelado.DefaultPageSettings.PaperSize = pd.DefaultPageSettings.PaperSize;
                    tiketHelado.DefaultPageSettings.Margins = pd.DefaultPageSettings.Margins;
                    tiketHelado.PrintPage += (sender, e) => ImprimirTicketProductos(_ventaHelados.DetallesVentas, AclaracionHeladeria, e, "¡TU HELADO TE ESPERA!");
                    tiketHelado.Print();
                }

                pd.PrintPage += Pd_PrintPageConstancia;
                pd.Print();

                
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al imprimir: {ex.Message}", ex);
            }
        }

        public async void ImprimirTicketVentaFiscal(Venta venta, string AclaracionCafeteria, string AclaracionHeladeria)
        {
            try
            {
                int modoImpresion = ObtenerModoImpresion();
                _ventaActual = venta;
                decimal totalDecimal = (decimal)_ventaActual.TotalVenta;
                FacturaResponse = await webService.GenerarFacturaConsumidorFinal(totalDecimal);

                // Separar productos por categoría
                ProductosCageteria(_ventaActual);

                // Configuración común para todos los documentos
                var paperSize = GetPaperSize();
                var margins = new Margins(5, 5, 15, 30);

                // 1. Imprimir comanda de cafetería si hay productos
                if (_ventacafeteria.DetallesVentas.Count > 0 || _ventacafeteria.ConceptosVarios?.Count > 0)
                {
                    PrintDocument tiketCafe = new PrintDocument();
                    ConfigurePrintDocument(tiketCafe, paperSize, margins);
                    tiketCafe.PrintPage += (sender, e) => ImprimirTicketProductos(
                        _ventacafeteria.DetallesVentas,
                        AclaracionCafeteria,
                        e,
                        "COMANDA N");
                    tiketCafe.Print();
                }

                // 2. Imprimir ticket de heladería si hay productos
                if (_ventaHelados.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketHelado = new PrintDocument();
                    ConfigurePrintDocument(tiketHelado, paperSize, margins);
                    tiketHelado.PrintPage += (sender, e) => ImprimirTicketProductos(
                        _ventaHelados.DetallesVentas,
                        AclaracionHeladeria,
                        e,
                        "¡TU HELADO TE ESPERA!");
                    tiketHelado.Print();
                }

                // 3. Imprimir ticket fiscal principal
                PrintDocument pdFiscal = new PrintDocument();
                ConfigurePrintDocument(pdFiscal, paperSize, margins);
                pdFiscal.PrintPage += Pd_PrintPageFiscal;
                pdFiscal.Print();

                // 4. Si está en modo impresión 1, imprimir constancia (similar al ticket normal)
                if (modoImpresion == 1)
                {
                    PrintDocument pdConstancia = new PrintDocument();
                    ConfigurePrintDocument(pdConstancia, paperSize, margins);
                    pdConstancia.PrintPage += Pd_PrintPageFiscalConstancia;
                    pdConstancia.Print();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al imprimir: {ex.Message}", ex);
            }
        }
       
        private void Pd_PrintPageFiscal(object sender, PrintPageEventArgs e)
        {
            try
            {
                using (Font fuenteNormal = new Font("Arial", 10))
                using (Font fuenteGrande = new Font("Arial", 13, FontStyle.Bold))
                using (Font fuentePequena = new Font("Arial", 9))
                using (Font fuenteLeyenda = new Font("Arial", 8, FontStyle.Italic))
                {
                    Graphics g = e.Graphics;
                    float yPos = e.MarginBounds.Top;
                    float leftMargin = e.MarginBounds.Left;
                    float printableWidth = e.MarginBounds.Width;
                    float rightMargin = leftMargin + printableWidth;

                    // Encabezado
                    string razonSocial = "Razón Social: ADRIAN OSCAR GIANETTI";
                    string cuit = "CUIT: 20127915130";
                    string ingresosBrutos = "Ingresos Brutos: 20127915130";
                    string domicilio = "CALLE 21 799 MIRAMAR";
                    string inicioActividades = "Inicio de Actividades: 01/04/2015";
                    string iva = "IVA: Responsable Inscripto";

                    // Centrar encabezados
                    g.DrawString(razonSocial, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString(cuit, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString(ingresosBrutos, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString(domicilio, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString(inicioActividades, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString(iva, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    string puntoVenta = "P.V. N: 30";
                    string ticketNumero = $"Ticket #: {FacturaResponse.NumeroComprobante.ToString().PadLeft(8, '0')}";

                    g.DrawString(ticketNumero, fuenteNormal, Brushes.Black, rightMargin - g.MeasureString(ticketNumero, fuenteNormal).Width - 20, yPos);
                    g.DrawString(puntoVenta, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    // Fecha a la izquierda, hora a la derecha
                    string fecha = $"Fecha: {FacturaResponse.FechaEmision:dd/MM/yyyy}";
                    string hora = $"Hora: {FacturaResponse.FechaEmision:HH:mm}";

                    g.DrawString(fecha, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString(hora, fuenteNormal, Brushes.Black, rightMargin - g.MeasureString(hora, fuenteNormal).Width - 65, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Configurar columnas con las mismas posiciones que Pd_PrintPage
                    float colDesc = 5;
                    float colCant = 160;
                    float colPU = 200;
                    float colTotal = 243;

                    // Encabezados de columnas
                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, colDesc, yPos);
                    g.DrawString("Cant", fuenteNormal, Brushes.Black, colCant, yPos);
                    g.DrawString("P.U.", fuenteNormal, Brushes.Black, colPU, yPos);
                    g.DrawString("Total", fuenteNormal, Brushes.Black, colTotal, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Productos - mismo formato que Pd_PrintPage
                    foreach (var detalle in _ventaActual.DetallesVentas)
                    {
                        string nombreProducto = detalle.Producto.NombreProducto;
                        if (nombreProducto.Length > 25)
                            nombreProducto = nombreProducto.Substring(0, 22) + "...";

                        g.DrawString(nombreProducto, fuenteNormal, Brushes.Black, colDesc, yPos);
                        g.DrawString(detalle.Cantidad.ToString(), fuenteNormal, Brushes.Black, colCant + 10, yPos);
                        g.DrawString(detalle.PrecioUnitario.ToString("N0"), fuenteNormal, Brushes.Black, colPU - 6, yPos);
                        g.DrawString((detalle.Cantidad * detalle.PrecioUnitario).ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 3, yPos);
                        yPos += 20;
                    }

                    // Conceptos varios - mismo formato
                    if (_ventaActual.ConceptosVarios != null)
                    {
                        foreach (var concepto in _ventaActual.ConceptosVarios)
                        {
                            string nombre = concepto.Nombre.Length > 25 ?
                                            concepto.Nombre.Substring(0, 22) + "..." :
                                            concepto.Nombre;

                            g.DrawString(nombre, fuenteNormal, Brushes.Black, colDesc, yPos);
                            g.DrawString("1", fuenteNormal, Brushes.Black, colCant + 10, yPos);
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colPU - 6, yPos);
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 5, yPos);
                            yPos += 20;
                        }
                    }


                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Total corregido más a la izquierda
                    string total = $"TOTAL: {FacturaResponse.ImporteTotal.ToString("C2")}";
                    SizeF totalSize = g.MeasureString(total, fuenteGrande);
                    g.DrawString(total, fuenteGrande, Brushes.Black, rightMargin - totalSize.Width - 45, yPos);
                    yPos += totalSize.Height + 20;

                    // Generar QR
                    string qrText = FacturaResponse.DatosQR;
                    QRCodeWriter qrWriter = new QRCodeWriter();
                    var qrMatrix = qrWriter.encode(qrText, BarcodeFormat.QR_CODE, 150, 150);

                    Bitmap qrBitmap = new Bitmap(150, 150);
                    for (int i = 0; i < 150; i++)
                    {
                        for (int j = 0; j < 150; j++)
                        {
                            qrBitmap.SetPixel(i, j, qrMatrix[i, j] ? Color.Black : Color.White);
                        }
                    }

                    int qrX = (int)(leftMargin + (printableWidth - qrBitmap.Width) / 2);
                    g.DrawImage(qrBitmap, qrX, yPos);
                    yPos += qrBitmap.Height + 10;
                    qrBitmap.Dispose();

                    string netoGravado = $"Neto Gravado: {FacturaResponse.ImporteNeto.ToString("C2")}";
                    string iva21 = $"IVA 21%: {FacturaResponse.ImporteIVA.ToString("C2")}";

                    g.DrawString(netoGravado, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString(iva21, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    string caeNumero = FacturaResponse.CAE;
                    string vencimientoFecha = FacturaResponse.VencimientoCAE;

                    string caeLeyenda = "CAE Nro:";
                    string vencimientoLeyenda = "Fecha de Vencimiento:";

                    g.DrawString(caeLeyenda, fuenteLeyenda, Brushes.Black, leftMargin, yPos);
                    g.DrawString(caeNumero, fuenteLeyenda, Brushes.Black, leftMargin + g.MeasureString(caeLeyenda, fuenteLeyenda).Width + 5, yPos);
                    yPos += 20;

                    g.DrawString(vencimientoLeyenda, fuenteLeyenda, Brushes.Black, leftMargin, yPos);
                    g.DrawString(vencimientoFecha, fuenteLeyenda, Brushes.Black, leftMargin + g.MeasureString(vencimientoLeyenda, fuenteLeyenda).Width + 5, yPos);
                    yPos += 20;

                    string pieTicket = "¡Gracias por su compra!";
                    CentrarTexto(g, pieTicket, fuenteGrande, leftMargin, printableWidth, yPos);
                    yPos += g.MeasureString(pieTicket, fuenteGrande).Height + 10;

                    e.HasMorePages = false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al generar la página del ticket: {ex.Message}", ex);
            }
        }

        /*private void Pd_PrintPage(object sender, PrintPageEventArgs e)
        {
            try
            {
                using (Font fuenteNormal = new Font("Arial", 10))
                using (Font fuenteGrande = new Font("Arial", 13, FontStyle.Bold))
                using (Font fuentePequena = new Font("Arial", 9))
                using (Font fuenteLeyenda = new Font("Arial", 6, FontStyle.Italic))
                {
                    Graphics g = e.Graphics;
                    float yPos = e.MarginBounds.Top;
                    float leftMargin = e.MarginBounds.Left;
                    float printableWidth = e.MarginBounds.Width;
                    float rightMargin = leftMargin + printableWidth;

                    string titulo = "HELADERIA GIANNI";
                    CentrarTexto(g, titulo, fuenteGrande, leftMargin, printableWidth, yPos);
                    yPos += g.MeasureString(titulo, fuenteGrande).Height + 5;

                    // Fecha a la izquierda, hora a la derecha
                    string fecha = $"Fecha: {_ventaActual.FechaDeVenta:dd/MM/yyyy}";
                    string hora = $"Hora: {_ventaActual.FechaDeVenta:HH:mm}";

                    g.DrawString(fecha, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString(hora, fuenteNormal, Brushes.Black, rightMargin - g.MeasureString(hora, fuenteNormal).Width - 35, yPos);
                    yPos += 20;

                    // Número de ticket debajo a la izquierda
                    string ticketInfo = $"Ticket #: {_ventaActual.Id.ToString().PadLeft(8, '0')}";
                    g.DrawString(ticketInfo, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 25;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Configurar columnas reorganizadas
                    float colDesc = 5;
                    float colCant = 155;
                    float colPU = 195;
                    float colTotal = 238;

                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, colDesc, yPos);
                    g.DrawString("Cant", fuenteNormal, Brushes.Black, colCant, yPos);
                    g.DrawString("P.U.", fuenteNormal, Brushes.Black, colPU, yPos);
                    g.DrawString("Total", fuenteNormal, Brushes.Black, colTotal, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;
                    //ACA
                    // Productos - sin signo $
                    foreach (var detalle in _ventaActual.DetallesVentas)
                    {
                        string nombreProducto = detalle.Producto.NombreProducto;
                        if (nombreProducto.Length > 25)
                            nombreProducto = nombreProducto.Substring(0, 22) + "...";

                        g.DrawString(nombreProducto, fuenteNormal, Brushes.Black, colDesc, yPos);
                        g.DrawString(detalle.Cantidad.ToString(), fuenteNormal, Brushes.Black, colCant +5 , yPos);
                        g.DrawString(detalle.PrecioUnitario.ToString("N0"), fuenteNormal, Brushes.Black , colPU - 6, yPos);
                        g.DrawString((detalle.Cantidad * detalle.PrecioUnitario).ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 3, yPos);
                        yPos += 20;
                    }

                    // Conceptos varios - sin signo $ (mismo formato que productos)
                    if (_ventaActual.ConceptosVarios != null)
                    {
                        foreach (var concepto in _ventaActual.ConceptosVarios)
                        {
                            string nombre = concepto.Nombre.Length > 25 ?
                                           concepto.Nombre.Substring(0, 22) + "..." :
                                           concepto.Nombre;

                            g.DrawString(nombre, fuenteNormal, Brushes.Black, colDesc, yPos);
                            g.DrawString("1", fuenteNormal, Brushes.Black, colCant + 5, yPos); // Cantidad fija "1" alineada
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colPU - 6, yPos); // Precio alineado
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 4, yPos); // Total alineado
                            yPos += 20;
                        }
                    }

                    yPos += 5;
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    if (_ventaActual.Descuentos > 0)
                    {
                        string descuento = $"Descuento: {_ventaActual.Descuentos.ToString("N0")}";
                        SizeF descuentoSize = g.MeasureString(descuento, fuenteGrande);
                        g.DrawString(descuento, fuenteGrande, Brushes.Black, rightMargin - descuentoSize.Width - 20, yPos);
                        yPos += descuentoSize.Height + 10;
                    }

                    // Total corregido más a la izquierda
                    string total = $"TOTAL: {_ventaActual.TotalVenta.ToString("N0")}";
                    SizeF totalSize = g.MeasureString(total, fuenteGrande);
                    g.DrawString(total, fuenteGrande, Brushes.Black, rightMargin - totalSize.Width - 45, yPos);
                    yPos += totalSize.Height + 20;

                    string pieTicket = "¡Gracias por su compra!";
                    CentrarTexto(g, pieTicket, fuenteGrande, leftMargin, printableWidth, yPos);
                    yPos += g.MeasureString(pieTicket, fuenteGrande).Height + 10;

                    string leyenda = "NO VALIDO COMO FACTURA,\nSOLICITE SU FACTURA POR CAJA";
                    string[] lineasLeyenda = leyenda.Split('\n');

                    yPos += 10;

                    foreach (string linea in lineasLeyenda)
                    {
                        CentrarTexto(g, linea.Trim(), fuenteLeyenda, leftMargin, printableWidth, yPos);
                        yPos += g.MeasureString(linea, fuenteLeyenda).Height;
                    }

                    e.HasMorePages = false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al generar la página del ticket: {ex.Message}", ex);
            }
        }*/

        private void ImprimirTicketProductos(List<DetalleVenta> detallesVenta, string aclaracion, PrintPageEventArgs e, string titulo)
        {
            try
            {
                using (Font fuenteNormal = new Font("Arial", 10))
                using (Font fuenteGrande = new Font("Arial", 12, FontStyle.Bold))
                using (Font fuenteContador = new Font("Arial", 24, FontStyle.Bold))
                {
                    Graphics g = e.Graphics;
                    float yPos = e.MarginBounds.Top;
                    float leftMargin = e.MarginBounds.Left;
                    float printableWidth = e.MarginBounds.Width;
                    int comanda = ObtenerNumeroComanda();
                    // Título con misma tipografía para ambos
                    if (titulo == "COMANDA N")
                    {
                        CentrarTexto(g, titulo + $" {comanda}", fuenteGrande, leftMargin, printableWidth, yPos);
                        yPos += g.MeasureString(titulo, fuenteGrande).Height + 3;
                    }

                    // Solo para heladería mostrar el contador
                    if (titulo == "¡TU HELADO TE ESPERA!")
                    {
                        CentrarTexto(g, titulo, fuenteGrande, leftMargin, printableWidth, yPos);
                        yPos += g.MeasureString(titulo, fuenteGrande).Height + 3;
                        int contador = ObtenerYActualizarContador();
                        string contadorFormateado = contador.ToString("00");

                        CentrarTexto(g, contadorFormateado, fuenteContador, leftMargin, printableWidth, yPos);
                        yPos += g.MeasureString(contadorFormateado, fuenteContador).Height + 5;
                    }

                    // Fecha a la izquierda, hora a la derecha
                    string fecha = $"Fecha: {DateTime.Now:dd/MM/yyyy}";
                    string hora = $"Hora: {DateTime.Now:HH:mm}";

                    g.DrawString(fecha, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString(hora, fuenteNormal, Brushes.Black, leftMargin +180, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, leftMargin + printableWidth, yPos);
                    yPos += 10;

                    // Configurar columnas - cantidad corregida a la izquierda
                    float colDesc = leftMargin + 5;
                    float colCant = leftMargin + printableWidth * 0.70f;

                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, colDesc, yPos);
                    g.DrawString("Cantidad", fuenteNormal, Brushes.Black, colCant, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, leftMargin + printableWidth, yPos);
                    yPos += 10;

                    foreach (var detalle in detallesVenta)
                    {
                        string nombreProducto = detalle.Producto.NombreProducto;
                        if (nombreProducto.Length > 25)
                            nombreProducto = nombreProducto.Substring(0, 22) + "...";

                        g.DrawString(nombreProducto, fuenteGrande, Brushes.Black, colDesc, yPos);
                        CentrarTextoEnColumna(g, detalle.Cantidad.ToString(), fuenteGrande, colCant, printableWidth * 0.22f, yPos);
                        yPos += 20;
                    }

                    // Conceptos varios - sin signo $ (mismo formato que productos)
                    if (_ventaVarios.ConceptosVarios != null)
                    {
                        foreach (var concepto in _ventaActual.ConceptosVarios)
                        {
                            string nombre = concepto.Nombre.Length > 25 ?
                                           concepto.Nombre.Substring(0, 22) + "..." :
                                           concepto.Nombre;

                            g.DrawString(nombre, fuenteGrande, Brushes.Black, colDesc, yPos);
                            CentrarTextoEnColumna(g,"1", fuenteGrande, colCant, printableWidth * 0.22f, yPos);
                            //g.DrawString("1", fuenteGrande, Brushes.Black, colCant + 20, yPos); 
                          
                            yPos += 20;
                        }
                        _ventaVarios.ConceptosVarios = null;
                    }


                    if (!string.IsNullOrEmpty(aclaracion))
                    {
                        yPos += 10;
                        string aclaracionTexto = $"Aclaración: {aclaracion}";
                        CentrarTexto(g, aclaracionTexto, fuenteGrande, leftMargin, printableWidth, yPos);
                        yPos += 20;
                    }

                    yPos += 40;
                    e.HasMorePages = false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al imprimir: {ex.Message}", ex);
            }
        }

        // Método auxiliar para centrar texto
        private void CentrarTexto(Graphics g, string texto, Font fuente, float leftMargin, float ancho, float yPos)
        {
            SizeF textoSize = g.MeasureString(texto, fuente);
            float xPos = leftMargin + (ancho - textoSize.Width) / 2;
            g.DrawString(texto, fuente, Brushes.Black, xPos, yPos);
        }

        // Método auxiliar para centrar texto en una columna específica
        private void CentrarTextoEnColumna(Graphics g, string texto, Font fuente, float columnaInicio, float anchoColumna, float yPos)
        {
            SizeF textoSize = g.MeasureString(texto, fuente);
            float xPos = columnaInicio + (anchoColumna - textoSize.Width) / 2;
            g.DrawString(texto, fuente, Brushes.Black, xPos, yPos);
        }

        private void ProductosCageteria(Venta venta)
        {
            _ventaHelados.DetallesVentas.Clear();
            _ventacafeteria.DetallesVentas.Clear();
            _ventaVarios.ConceptosVarios?.Clear(); // Usar null-conditional por seguridad

            foreach (var detalle in venta.DetallesVentas)
            {
                if (detalle.Producto.ProductoCategoriaId == 2) // Solo helados
                {
                    _ventaHelados.DetallesVentas.Add(detalle);
                }
                else // Todo lo demás va a cafetería
                {
                    _ventacafeteria.DetallesVentas.Add(detalle);
                }
            }

            // Mover todos los conceptos varios a cafetería
            if (venta.ConceptosVarios != null)
            {
                _ventacafeteria.ConceptosVarios = venta.ConceptosVarios;
            }
        }

        private int ObtenerYActualizarContador()
        {
            try
            {
                if (!File.Exists(RUTA_CONTADOR))
                {
                    File.WriteAllText(RUTA_CONTADOR, "0");
                    return 0;
                }

                string contenido = File.ReadAllText(RUTA_CONTADOR);
                int contadorActual = int.TryParse(contenido, out int result) ? result : 0;
                int nuevoContador = (contadorActual + 1) % 100;
                File.WriteAllText(RUTA_CONTADOR, nuevoContador.ToString());
                return nuevoContador;
            }
            catch
            {
                return 0;
            }
        }

        private int ObtenerNumeroComanda()
        {
            try
            {
                if (!File.Exists(RUTA_COMANDA))
                {
                    File.WriteAllText(RUTA_COMANDA, "0");
                    return 0;
                }

                string contenido = File.ReadAllText(RUTA_COMANDA);
                int contadorActual = int.TryParse(contenido, out int result) ? result : 0;
                int nuevoContador = (contadorActual + 1) % 100;
                File.WriteAllText(RUTA_COMANDA, nuevoContador.ToString());
                return nuevoContador;
            }
            catch
            {
                return 0;
            }
        }

        private void Pd_PrintPageFiscalConstancia(object sender, PrintPageEventArgs e)
        {
            try
            {
                using (Font fuenteNormal = new Font("Arial", 10))
                using (Font fuenteGrande = new Font("Arial", 13, FontStyle.Bold))
                {
                    Graphics g = e.Graphics;
                    float yPos = e.MarginBounds.Top;
                    float leftMargin = e.MarginBounds.Left;
                    float printableWidth = e.MarginBounds.Width;
                    float rightMargin = leftMargin + printableWidth;

                    // Encabezado simplificado
                    string titulo = "CONSTANCIA FISCAL";
                    CentrarTexto(g, titulo, fuenteGrande, leftMargin, printableWidth, yPos);
                    yPos += g.MeasureString(titulo, fuenteGrande).Height + 5;

                    // Información fiscal básica
                    string puntoVenta = "P.V. 0030";
                    string comprobante = $"Comp. {FacturaResponse.NumeroComprobante.ToString().PadLeft(8, '0')}";

                    g.DrawString(puntoVenta, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString(comprobante, fuenteNormal, Brushes.Black, rightMargin - g.MeasureString(comprobante, fuenteNormal).Width, yPos);
                    yPos += 20;

                    // Fecha y hora
                    string fechaHora = $"Fecha: {FacturaResponse.FechaEmision:dd/MM/yyyy HH:mm}";
                    g.DrawString(fechaHora, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Columnas
                    float colDesc = 5;
                    float colCant = 155;
                    float colPU = 195;
                    float colTotal = 238;

                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, colDesc, yPos);
                    g.DrawString("Cant", fuenteNormal, Brushes.Black, colCant, yPos);
                    g.DrawString("P.U.", fuenteNormal, Brushes.Black, colPU, yPos);
                    g.DrawString("Total", fuenteNormal, Brushes.Black, colTotal, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Productos
                    foreach (var detalle in _ventaActual.DetallesVentas)
                    {
                        string nombreProducto = detalle.Producto.NombreProducto;
                        if (nombreProducto.Length > 25)
                            nombreProducto = nombreProducto.Substring(0, 22) + "...";

                        g.DrawString(nombreProducto, fuenteNormal, Brushes.Black, colDesc, yPos);
                        g.DrawString(detalle.Cantidad.ToString(), fuenteNormal, Brushes.Black, colCant + 5, yPos);
                        g.DrawString(detalle.PrecioUnitario.ToString("N0"), fuenteNormal, Brushes.Black, colPU - 6, yPos);
                        g.DrawString((detalle.Cantidad * detalle.PrecioUnitario).ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 3, yPos);
                        yPos += 20;
                    }

                    // Conceptos varios
                    if (_ventaActual.ConceptosVarios != null)
                    {
                        foreach (var concepto in _ventaActual.ConceptosVarios)
                        {
                            string nombre = concepto.Nombre.Length > 25 ?
                                           concepto.Nombre.Substring(0, 22) + "..." :
                                           concepto.Nombre;

                            g.DrawString(nombre, fuenteNormal, Brushes.Black, colDesc, yPos);
                            g.DrawString("1", fuenteNormal, Brushes.Black, colCant + 5, yPos);
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colPU - 6, yPos);
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 4, yPos);
                            yPos += 20;
                        }
                    }

                    yPos += 5;
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Total
                    string total = $"TOTAL: {FacturaResponse.ImporteTotal.ToString("C2")}";
                    SizeF totalSize = g.MeasureString(total, fuenteGrande);
                    g.DrawString(total, fuenteGrande, Brushes.Black, rightMargin - totalSize.Width - 45, yPos);
                    yPos += totalSize.Height + 20;

                    // Información CAE simplificada
                    string infoCAE = $"CAE: {FacturaResponse.CAE} (Vto: {FacturaResponse.VencimientoCAE})";
                    CentrarTexto(g, infoCAE, fuenteNormal, leftMargin, printableWidth, yPos);

                    e.HasMorePages = false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al generar la página del ticket: {ex.Message}", ex);
            }
        }

        private void Pd_PrintPageConstancia(object sender, PrintPageEventArgs e)
        {
            try
            {
                using (Font fuenteNormal = new Font("Arial", 10))
                using (Font fuenteGrande = new Font("Arial", 13, FontStyle.Bold))
                using (Font fuentePequena = new Font("Arial", 9))
                using (Font fuenteLeyenda = new Font("Arial", 6, FontStyle.Italic))
                {
                    Graphics g = e.Graphics;
                    float yPos = e.MarginBounds.Top;
                    float leftMargin = e.MarginBounds.Left;
                    float printableWidth = e.MarginBounds.Width;
                    float rightMargin = leftMargin + printableWidth;

                    // Fecha a la izquierda, hora a la derecha
                    string fecha = $"Fecha: {_ventaActual.FechaDeVenta:dd/MM/yyyy}";
                    string hora = $"Hora: {_ventaActual.FechaDeVenta:HH:mm}";

                    g.DrawString(fecha, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString(hora, fuenteNormal, Brushes.Black, rightMargin - g.MeasureString(hora, fuenteNormal).Width - 35, yPos);
                    yPos += 20;

                    // Número de ticket debajo a la izquierda
                    string ticketInfo = $"Ticket #: {_ventaActual.Id.ToString().PadLeft(8, '0')}";
                    g.DrawString(ticketInfo, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 25;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Configurar columnas reorganizadas
                    float colDesc = 5;
                    float colCant = 155;
                    float colPU = 195;
                    float colTotal = 238;

                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, colDesc, yPos);
                    g.DrawString("Cant", fuenteNormal, Brushes.Black, colCant, yPos);
                    g.DrawString("P.U.", fuenteNormal, Brushes.Black, colPU, yPos);
                    g.DrawString("Total", fuenteNormal, Brushes.Black, colTotal, yPos);
                    yPos += 20;

                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;
                    //ACA
                    // Productos - sin signo $
                    foreach (var detalle in _ventaActual.DetallesVentas)
                    {
                        string nombreProducto = detalle.Producto.NombreProducto;
                        if (nombreProducto.Length > 25)
                            nombreProducto = nombreProducto.Substring(0, 22) + "...";

                        g.DrawString(nombreProducto, fuenteNormal, Brushes.Black, colDesc, yPos);
                        g.DrawString(detalle.Cantidad.ToString(), fuenteNormal, Brushes.Black, colCant + 5, yPos);
                        g.DrawString(detalle.PrecioUnitario.ToString("N0"), fuenteNormal, Brushes.Black, colPU - 6, yPos);
                        g.DrawString((detalle.Cantidad * detalle.PrecioUnitario).ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 3, yPos);
                        yPos += 20;
                    }

                    // Conceptos varios - sin signo $ (mismo formato que productos)
                    if (_ventaActual.ConceptosVarios != null)
                    {
                        foreach (var concepto in _ventaActual.ConceptosVarios)
                        {
                            string nombre = concepto.Nombre.Length > 25 ?
                                           concepto.Nombre.Substring(0, 22) + "..." :
                                           concepto.Nombre;

                            g.DrawString(nombre, fuenteNormal, Brushes.Black, colDesc, yPos);
                            g.DrawString("1", fuenteNormal, Brushes.Black, colCant + 5, yPos); // Cantidad fija "1" alineada
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colPU - 6, yPos); // Precio alineado
                            g.DrawString(concepto.Precio.ToString("N0"), fuenteNormal, Brushes.Black, colTotal - 4, yPos); // Total alineado
                            yPos += 20;
                        }
                    }

                    yPos += 5;
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    if (_ventaActual.Descuentos > 0)
                    {
                        string descuento = $"Descuento: {_ventaActual.Descuentos.ToString("N0")}";
                        SizeF descuentoSize = g.MeasureString(descuento, fuenteGrande);
                        g.DrawString(descuento, fuenteGrande, Brushes.Black, rightMargin - descuentoSize.Width - 20, yPos);
                        yPos += descuentoSize.Height + 10;
                    }

                    // Total corregido más a la izquierda
                    string total = $"TOTAL: {_ventaActual.TotalVenta.ToString("N0")}";
                    SizeF totalSize = g.MeasureString(total, fuenteGrande);
                    g.DrawString(total, fuenteGrande, Brushes.Black, rightMargin - totalSize.Width - 45, yPos);
                    yPos += totalSize.Height + 20;

                    e.HasMorePages = false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al generar la página del ticket: {ex.Message}", ex);
            }
        }

        // Métodos auxiliares para simplificar el código
        private PaperSize GetPaperSize()
        {
            PrintDocument pd = new PrintDocument();
            foreach (PaperSize size in pd.PrinterSettings.PaperSizes)
            {
                if (size.PaperName.Contains("80 x 3276"))
                {
                    return size;
                }
            }
            return pd.DefaultPageSettings.PaperSize; // Tamaño por defecto si no se encuentra
        }

        private void ConfigurePrintDocument(PrintDocument doc, PaperSize paperSize, Margins margins)
        {
            doc.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
            doc.DefaultPageSettings.PaperSize = paperSize;
            doc.DefaultPageSettings.Margins = margins;

            if (!doc.PrinterSettings.IsValid)
            {
                throw new Exception($"La impresora '{NOMBRE_IMPRESORA}' no está disponible");
            }
        }

    }
}