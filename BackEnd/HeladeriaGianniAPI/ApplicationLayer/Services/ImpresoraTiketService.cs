using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Printing;
using System.Net.NetworkInformation;
using DomainLayer.Models;
using ZXing;
using ZXing.Common;
using ZXing.QrCode;

namespace ApplicationLayer.Services
{
    public class ImpresoraTicketService
    {
        private const string NOMBRE_IMPRESORA = "GianniPrinter";
        private const int ANCHO_TICKET = 280;
        private readonly WSFEService webService;
        private Venta _ventaActual;
        private Venta _ventaHelados = new Venta();
        private Venta _ventacafeteria = new Venta();
        private FacturaResponse FacturaResponse;
        private static int _contadorHeladeria = 98;

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

        public void ImprimirTicketVenta(Venta venta, string AclaracionCafeteria, string AclaracionHeladeria)
        {
            try
            {
                _ventaActual = venta;

                // Llamar al método que obtiene los detalles de venta
                ProductosCageteria(_ventaActual);
                // Crear las impresoras
                PrintDocument pd = new PrintDocument();
                // Configurar las impresoras
                pd.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;

                // Validar impresora
                if (!pd.PrinterSettings.IsValid)
                {
                    throw new Exception($"La impresora '{NOMBRE_IMPRESORA}' no está disponible");
                }

                // Imprimir los productos para la cafetería
                if(_ventacafeteria.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketCafe = new PrintDocument();
                    tiketCafe.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
                    // Usamos el evento PrintPage para el método de impresión
                    tiketCafe.PrintPage += (sender, e) => ImprimirTicketProductos(_ventacafeteria.DetallesVentas, AclaracionCafeteria, e, "CAFETERIA");
                    tiketCafe.Print();
                }
                if (_ventaHelados.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketHelado = new PrintDocument();
                    tiketHelado.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
                    tiketHelado.PrintPage += (sender, e) => ImprimirTicketProductos(_ventaHelados.DetallesVentas, AclaracionHeladeria, e, "HELADERIA");
                    tiketHelado.Print();
                }
    
                // Configurar el método para la impresión general
                pd.PrintPage += Pd_PrintPage;

                // Realizar la impresión
                pd.Print();

            }
            catch (Exception ex)
            {
                throw new Exception($"Error al imprimir: {ex.Message}", ex);
            }
        }

        public  async void ImprimirTicketVentaFiscal(Venta venta, string AclaracionCafeteria, string AclaracionHeladeria)
        {
           
            try
            {
                _ventaActual = venta;
                decimal totalDecimal = (decimal)_ventaActual.TotalVenta;
                FacturaResponse = await webService.GenerarFacturaConsumidorFinal(totalDecimal);
                // Llamar al método que obtiene los detalles de venta
                ProductosCageteria(_ventaActual);
                // Crear las impresoras
                PrintDocument pd = new PrintDocument();
                // Configurar las impresoras
                pd.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;

                // Validar impresora
                if (!pd.PrinterSettings.IsValid)
                {
                    throw new Exception($"La impresora '{NOMBRE_IMPRESORA}' no está disponible");
                }

                // Imprimir los productos para la cafetería
                if (_ventacafeteria.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketCafe = new PrintDocument();
                    tiketCafe.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
                    // Usamos el evento PrintPage para el método de impresión
                    tiketCafe.PrintPage += (sender, e) => ImprimirTicketProductos(_ventacafeteria.DetallesVentas, AclaracionCafeteria, e, "CAFETERIA");
                    tiketCafe.Print();
                }
                if (_ventaHelados.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketHelado = new PrintDocument();
                    tiketHelado.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
                    tiketHelado.PrintPage += (sender, e) => ImprimirTicketProductos(_ventaHelados.DetallesVentas, AclaracionHeladeria, e, "HELADERIA");
                    tiketHelado.Print();
                }

                // Configurar el método para la impresión general
                pd.PrintPage += Pd_PrintPageFiscal;

                // Realizar la impresión
                pd.Print();

            }
            catch (Exception ex)
            {
                throw new Exception($"Error al imprimir: {ex.Message}", ex);
            }
        }

        #region MetodosPrivaos
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
                float yPos = 10;
                float leftMargin = 2;
                float rightMargin = ANCHO_TICKET - 2;

                // Encabezado
                string razonSocial = "Razón Social: Heladería Gianni S.A.";
                string cuit = "CUIT: 20-12345678-9";
                string ingresosBrutos = "Ingresos Brutos: 12345678";
                string domicilio = "Domicilio: Calle Ficticia 1234";
                string inicioActividades = "Inicio de Actividades: 01/01/2020";
                string iva = "IVA: Responsable Inscripto";

                // Razón Social
                g.DrawString(razonSocial, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // CUIT
                g.DrawString(cuit, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // Ingresos Brutos
                g.DrawString(ingresosBrutos, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // Domicilio
                g.DrawString(domicilio, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // Inicio de Actividades
                g.DrawString(inicioActividades, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // IVA
                g.DrawString(iva, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // Línea separadora
                g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                yPos += 10;

                // Ticket y Punto de Venta
                string puntoVenta = "P.V. N: 001"; // Esto se puede cambiar según corresponda
                string ticketNumero = $"Ticket #: {FacturaResponse.NumeroComprobante.ToString().PadLeft(8, '0')}";
                    string fechaHora = $"Fecha: {FacturaResponse.FechaEmision:dd/MM/yyyy}         Hora: {FacturaResponse.FechaEmision:HH:mm}";
                    // Resultado: "Fecha: 18/07/2024 - Hora: 14:30"

                    g.DrawString(ticketNumero, fuenteNormal, Brushes.Black, rightMargin - g.MeasureString(ticketNumero, fuenteNormal).Width, yPos);
                //yPos += 20;

                g.DrawString(puntoVenta, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                g.DrawString(fechaHora, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // Línea separadora
                g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                yPos += 10;

                // Encabezados de columnas para los productos
                g.DrawString("Descripción", fuenteNormal, Brushes.Black, leftMargin, yPos);
                g.DrawString("Cant", fuenteNormal, Brushes.Black, 135, yPos);  // Desplazado más a la derecha
                g.DrawString("P.U.", fuenteNormal, Brushes.Black, 180, yPos);  // Desplazado más a la izquierda
                g.DrawString("Total", fuenteNormal, Brushes.Black, 230, yPos); // Alineado con "P.U." más cerca
                yPos += 20;

                // Línea separadora antes de los productos
                g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                yPos += 10;

                // Detalles de productos
                foreach (var detalle in _ventaActual.DetallesVentas)
                {
                    string nombreProducto = detalle.Producto.NombreProducto;
                    if (nombreProducto.Length > 20)
                        nombreProducto = nombreProducto.Substring(0, 17) + "...";

                    g.DrawString(nombreProducto, fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString(detalle.Cantidad.ToString(), fuenteNormal, Brushes.Black, 145, yPos);  // Desplazado más a la derecha
                    g.DrawString(detalle.PrecioUnitario.ToString("C0"), fuenteNormal, Brushes.Black, 165, yPos);  // Desplazado
                    g.DrawString((detalle.Cantidad * detalle.PrecioUnitario).ToString("C0"), fuenteNormal, Brushes.Black, 225, yPos); // Alineado con "P.U." más cerca
                    yPos += 20;
                }

      

                    // Línea separadora antes del TOTAL
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Total
                    string total = $"TOTAL: {FacturaResponse.ImporteTotal.ToString("C2")}";
                    SizeF totalSize = g.MeasureString(total, fuenteGrande);
                    g.DrawString(total, fuenteGrande, Brushes.Black, rightMargin - totalSize.Width, yPos);
                    yPos += totalSize.Height + 20;


                // Generar QR
                string qrText = FacturaResponse.DatosQR;
                QRCodeWriter qrWriter = new QRCodeWriter();
                var qrMatrix = qrWriter.encode(qrText, BarcodeFormat.QR_CODE, 150, 150);

                // Convertir la matriz de QR a una imagen
                Bitmap qrBitmap = new Bitmap(150, 150);
                for (int i = 0; i < 150; i++)
                {
                    for (int j = 0; j < 150; j++)
                    {
                        qrBitmap.SetPixel(i, j, qrMatrix[i, j] ? Color.Black : Color.White);
                    }
                }

                // Dibujar el código QR en la posición deseada
                int qrX = (ANCHO_TICKET - qrBitmap.Width) / 2;
                g.DrawImage(qrBitmap, qrX, yPos);
                yPos += qrBitmap.Height + 10;

                // Liberar recursos
                qrBitmap.Dispose();

                // Discriminación de IVA
                string netoGravado = $"Neto Gravado: {FacturaResponse.ImporteNeto.ToString("C2")}";
                string iva21 = $"IVA 21%: {FacturaResponse.ImporteIVA.ToString("C2")}";

                g.DrawString(netoGravado, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                g.DrawString(iva21, fuenteNormal, Brushes.Black, leftMargin, yPos);
                yPos += 20;

                // Número de CAE y Fecha de Vencimiento
                string caeNumero = FacturaResponse.CAE;  // Reemplaza con el número real de CAE
                string vencimientoFecha = FacturaResponse.VencimientoCAE;  // Reemplaza con la fecha real de vencimiento

                // Leyenda para el número de CAE
                string caeLeyenda = "CAE Nro:";

                // Leyenda para la fecha de vencimiento
                string vencimientoLeyenda = "Fecha de Vencimiento:";

                // Dibujar la leyenda y el número de CAE
                g.DrawString(caeLeyenda, fuenteLeyenda, Brushes.Black, leftMargin, yPos);
                g.DrawString(caeNumero, fuenteLeyenda, Brushes.Black, leftMargin + g.MeasureString(caeLeyenda, fuenteLeyenda).Width + 5, yPos);  // Justificar el CAE a la derecha de la leyenda
                yPos += 20;

                // Dibujar la leyenda y la fecha de vencimiento
                g.DrawString(vencimientoLeyenda, fuenteLeyenda, Brushes.Black, leftMargin, yPos);
                g.DrawString(vencimientoFecha, fuenteLeyenda, Brushes.Black, leftMargin + g.MeasureString(vencimientoLeyenda, fuenteLeyenda).Width + 5, yPos);  // Justificar la fecha a la derecha de la leyenda
                yPos += 20;
                // Pie de página (opcional)
                string pieTicket = "¡Gracias por su compra!";
                SizeF pieSize = g.MeasureString(pieTicket, fuenteGrande);
                g.DrawString(pieTicket, fuenteGrande, Brushes.Black, (ANCHO_TICKET - pieSize.Width) / 2, yPos);
                yPos += pieSize.Height + 10;

                // Indicar que no hay más páginas
                e.HasMorePages = false;
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Error al generar la página del ticket: {ex.Message}", ex);
        }
    }

        private void Pd_PrintPage(object sender, PrintPageEventArgs e)
        {
            try
            {
                using (Font fuenteNormal = new Font("Arial", 10))
                using (Font fuenteGrande = new Font("Arial", 13, FontStyle.Bold))
                using (Font fuentePequena = new Font("Arial", 9))
                using (Font fuenteLeyenda = new Font("Arial", 6, FontStyle.Italic))
                {
                    Graphics g = e.Graphics;
                    float yPos = 10;
                    float leftMargin = 5;
                    float rightMargin = ANCHO_TICKET - 5;

                    // Encabezado
                    string titulo = "HELADERIA GIANNI";
                    SizeF tituloSize = g.MeasureString(titulo, fuenteGrande);
                    g.DrawString(titulo, fuenteGrande, Brushes.Black,
                        (ANCHO_TICKET - tituloSize.Width) / 2, yPos);
                    yPos += tituloSize.Height + 5;

                    // Información de la venta
                    string fechaHora = $"Fecha: {_ventaActual.FechaDeVenta:dd/MM/yyyy}         Hora: {_ventaActual.FechaDeVenta:HH:mm}";

                    g.DrawString(fechaHora,
                        fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString($"Ticket #: {_ventaActual.Id.ToString().PadLeft(8, '0')}",
                        fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 25;

                    // Línea separadora
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Encabezados de columnas
                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString("Cant", fuenteNormal, Brushes.Black, 135, yPos);  // Desplazado más a la derecha
                    g.DrawString("P.U.", fuenteNormal, Brushes.Black, 180, yPos);  // Desplazado más a la izquierda
                    g.DrawString("Total", fuenteNormal, Brushes.Black, 230, yPos); // Alineado con "P.U." más cerca
                    yPos += 20;
   
                    // Línea separadora
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Detalles de productos
                    foreach (var detalle in _ventaActual.DetallesVentas)
                    {
                        string nombreProducto = detalle.Producto.NombreProducto;
                        if (nombreProducto.Length > 20)
                            nombreProducto = nombreProducto.Substring(0, 17) + "...";

                        g.DrawString(nombreProducto,
                            fuenteNormal, Brushes.Black, leftMargin, yPos);

                        g.DrawString(detalle.Cantidad.ToString(),
                            fuenteNormal, Brushes.Black, 145, yPos);  // Desplazado más a la derecha

                        // Mostramos el precio unitario sin decimales y con formato de moneda
                        g.DrawString(detalle.PrecioUnitario.ToString("C0"),
                            fuenteNormal, Brushes.Black, 165, yPos);  // Desplazado

                        // Mostramos el total sin decimales y con formato de moneda
                        g.DrawString((detalle.Cantidad * detalle.PrecioUnitario).ToString("C0"),
                            fuenteNormal, Brushes.Black, 225, yPos); // Alineado con "P.U." más cerca
                        yPos += 20;
                    }

                    // Línea separadora antes del total
                    yPos += 5;
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Si hay descuento, imprimirlo
                    if (_ventaActual.Descuentos > 0)
                    {
                        string descuento = $"Descuento: {_ventaActual.Descuentos.ToString("C0")}";
                        SizeF descuentoSize = g.MeasureString(descuento, fuenteGrande);
                        g.DrawString(descuento, fuenteGrande, Brushes.Black,
                            rightMargin - descuentoSize.Width, yPos);
                        yPos += descuentoSize.Height + 10;
                    }

                    // Total
                    string total = $"TOTAL: {_ventaActual.TotalVenta.ToString("C0")}";
                    SizeF totalSize = g.MeasureString(total, fuenteGrande);
                    g.DrawString(total, fuenteGrande, Brushes.Black,
                        rightMargin - totalSize.Width, yPos);
                    yPos += totalSize.Height + 20;

                    // Pie de página
                    string pieTicket = "¡Gracias por su compra!";
                    SizeF pieSize = g.MeasureString(pieTicket, fuenteGrande);
                    g.DrawString(pieTicket, fuenteGrande, Brushes.Black,
                        (ANCHO_TICKET - pieSize.Width) / 2, yPos);
                    yPos += pieSize.Height + 10;

                    // Leyenda con varias líneas y más espacio
                    string leyenda = "NO VALIDO COMO FACTURA,\nANTES DE RETIRARSE SOLICITE SU FACTURA POR CAJA";
                    string[] lineasLeyenda = leyenda.Split('\n');
                    float alturaTotalLeyenda = 0;

                    // Calcular la altura total de las líneas de la leyenda
                    foreach (string linea in lineasLeyenda)
                    {
                        alturaTotalLeyenda += g.MeasureString(linea, fuenteLeyenda).Height;
                    }

                    // Ajustar la posición de la leyenda para que esté al final del ticket
                    yPos += 10;

                    // Dibujar cada línea de la leyenda
                    foreach (string linea in lineasLeyenda)
                    {
                        SizeF leyendaSize = g.MeasureString(linea, fuenteLeyenda);
                        g.DrawString(linea, fuenteLeyenda, Brushes.DarkRed,
                            (ANCHO_TICKET - leyendaSize.Width) / 2, yPos);  // Centrado y color más oscuro
                        yPos += leyendaSize.Height;  // Actualizamos la posición Y
                    }
                }

                // Indicar que no hay más páginas
                e.HasMorePages = false;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al generar la página del ticket: {ex.Message}", ex);
            }
        }

        private void ImprimirTicketProductos(List<DetalleVenta> detallesVenta, string aclaracion, PrintPageEventArgs e, string titulo)
        {
            try
            {
                using (Font fuenteNormal = new Font("Arial", 10))
                using (Font fuenteGrande = new Font("Arial", 12)) //FontStyle.Bold
                using (Font fuenteContador = new Font("Arial", 24, FontStyle.Bold)) // Fuente grande para el contador
                using (Font fuentePequena = new Font("Arial", 9))
                using (Font fuenteLeyenda = new Font("Arial", 8, FontStyle.Italic))
                {
                    Graphics g = e.Graphics;
                    float yPos = 10;
                    float leftMargin = 5;
                    float rightMargin = ANCHO_TICKET - 5;

                    // Título centrado
                    SizeF tituloSize = g.MeasureString(titulo, fuenteGrande);
                    g.DrawString(titulo, fuenteGrande, Brushes.Black,
                        (ANCHO_TICKET - tituloSize.Width) / 2, yPos);
                    yPos += tituloSize.Height + 3; // Espacio mínimo después del título

                    // Mostrar contador solo para HELADERIA (número grande y centrado)
                    if (titulo == "HELADERIA")
                    {
                        string contador = _contadorHeladeria.ToString("00"); // Formato 00-99
                        SizeF contadorSize = g.MeasureString(contador, fuenteContador);
                        g.DrawString(contador, fuenteContador, Brushes.Black,
                            (ANCHO_TICKET - contadorSize.Width) / 2, yPos);
                        yPos += contadorSize.Height + 5; // Espacio mínimo después del número

                        // Incrementar y reiniciar contador
                        _contadorHeladeria = (_contadorHeladeria + 1) % 100;
                    }

                    // Fecha (alineada a la izquierda)
                    g.DrawString($"Fecha: {DateTime.Now:dd/MM/yyyy HH:mm}",
                        fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    // Línea separadora
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Encabezados de columnas (Descripción | Cant)
                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString("Cantidad", fuenteNormal, Brushes.Black, 180, yPos);
                    yPos += 20;

                    // Línea separadora
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Detalles de productos
                    foreach (var detalle in detallesVenta)
                    {
                        string nombreProducto = detalle.Producto.NombreProducto;
                        if (nombreProducto.Length > 20)
                            nombreProducto = nombreProducto.Substring(0, 17) + "...";

                        g.DrawString(nombreProducto, fuenteGrande, Brushes.Black, leftMargin, yPos);
                        g.DrawString(detalle.Cantidad.ToString(), fuenteGrande, Brushes.Black, 200, yPos);
                        yPos += 20;
                    }

                    // Aclaración (si existe)
                    if (!string.IsNullOrEmpty(aclaracion))
                    {
                        yPos += 10;
                        g.DrawString($"Aclaración: {aclaracion}", fuenteGrande, Brushes.Black, leftMargin, yPos);
                        yPos += 20;
                    }

                    // Espacio final mínimo
                    yPos += 40;

                    // Fin del ticket
                    e.HasMorePages = false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al imprimir: {ex.Message}", ex);
            }
        }

        private void ProductosCageteria(Venta venta)
        {   
            foreach(var detalle in venta.DetallesVentas)
            {
                if(detalle.Producto.ProductoCategoriaId == 2)
                {
                    _ventacafeteria.DetallesVentas.Add(detalle);
                }
                if(detalle.Producto.ProductoCategoriaId == 1)
                {
                    _ventaHelados.DetallesVentas.Add(detalle);
                }
            }

        }

        #endregion
    }
}
