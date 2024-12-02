using System;
using System.Drawing;
using System.Drawing.Printing;
using DomainLayer.Models;

namespace ApplicationLayer.Services
{
    public class ImpresoraTicketService
    {
        private const string NOMBRE_IMPRESORA = "GianniPrinter";
        private const int ANCHO_TICKET = 280;
        private Venta _ventaActual;
        private Venta _ventaHelados = new Venta();
        private Venta _ventacafeteria = new Venta();

        public ImpresoraTicketService()
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
                    tiketCafe.PrintPage += (sender, e) => ImprimirTicketProductos(_ventacafeteria.DetallesVentas, AclaracionCafeteria, e);
                    tiketCafe.Print();
                }
                if (_ventaHelados.DetallesVentas.Count > 0)
                {
                    PrintDocument tiketHelado = new PrintDocument();
                    tiketHelado.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;
                    tiketHelado.PrintPage += (sender, e) => ImprimirTicketProductos(_ventaHelados.DetallesVentas, AclaracionHeladeria, e);
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


        private void Pd_PrintPage(object sender, PrintPageEventArgs e)
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
                    float leftMargin = 5;
                    float rightMargin = ANCHO_TICKET - 5;

                    // Encabezado
                    string titulo = "HELADERIA GIANNI";
                    SizeF tituloSize = g.MeasureString(titulo, fuenteGrande);
                    g.DrawString(titulo, fuenteGrande, Brushes.Black,
                        (ANCHO_TICKET - tituloSize.Width) / 2, yPos);
                    yPos += tituloSize.Height + 5;

                    // Información de la venta
                    g.DrawString($"Fecha: {_ventaActual.FechaDeVenta:dd/MM/yyyy HH:mm}",
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
                    g.DrawString("Cant", fuenteNormal, Brushes.Black, 115, yPos);  // Desplazado más a la derecha
                    g.DrawString("P.U.", fuenteNormal, Brushes.Black, 160, yPos);  // Desplazado más a la izquierda
                    g.DrawString("Total", fuenteNormal, Brushes.Black, 220, yPos); // Alineado con "P.U." más cerca
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
                            fuenteNormal, Brushes.Black, 125, yPos);  // Desplazado más a la derecha

                        // Mostramos el precio unitario sin decimales y con formato de moneda
                        g.DrawString(detalle.PrecioUnitario.ToString("C0"),
                            fuenteNormal, Brushes.Black, 155, yPos);  // Desplazado

                        // Mostramos el total sin decimales y con formato de moneda
                        g.DrawString((detalle.Cantidad * detalle.PrecioUnitario).ToString("C0"),
                            fuenteNormal, Brushes.Black, 215, yPos); // Alineado con "P.U." más cerca
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

        private void ImprimirTicketProductos(List<DetalleVenta> detallesVenta, string aclaracion, PrintPageEventArgs e)
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
                    float leftMargin = 5;
                    float rightMargin = ANCHO_TICKET - 5;

                    // Título
                    string titulo = "TICKET DE VENTA";
                    SizeF tituloSize = g.MeasureString(titulo, fuenteGrande);
                    g.DrawString(titulo, fuenteGrande, Brushes.Black,
                        (ANCHO_TICKET - tituloSize.Width) / 2, yPos);
                    yPos += tituloSize.Height + 5;

                    // Información de la venta
                    g.DrawString($"Fecha: {DateTime.Now:dd/MM/yyyy HH:mm}",
                        fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 20;

                    g.DrawString($"Total productos: {detallesVenta.Count}",
                        fuenteNormal, Brushes.Black, leftMargin, yPos);
                    yPos += 25;

                    // Línea separadora
                    g.DrawLine(Pens.Black, leftMargin, yPos, rightMargin, yPos);
                    yPos += 10;

                    // Encabezados de columnas
                    g.DrawString("Descripción", fuenteNormal, Brushes.Black, leftMargin, yPos);
                    g.DrawString("Cant", fuenteNormal, Brushes.Black, 115, yPos);  // Desplazado más a la derecha
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

                        g.DrawString(nombreProducto,
                            fuenteNormal, Brushes.Black, leftMargin, yPos);

                        g.DrawString(detalle.Cantidad.ToString(),
                            fuenteNormal, Brushes.Black, 125, yPos);  // Desplazado más a la derecha

                        yPos += 20;
                    }

                    // Si hay aclaración, imprimirla
                    if (!string.IsNullOrEmpty(aclaracion))
                    {
                        yPos += 10;
                        g.DrawString($"Aclaración: {aclaracion}",
                            fuenteGrande, Brushes.Black, leftMargin, yPos);
                        yPos += 20;
                    }
                    // **Agregar espacio vacío adicional al final**
                    yPos += 10;

                    // Indicar que no hay más páginas
                    e.HasMorePages = false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al generar la página del ticket: {ex.Message}", ex);
            }
        }


        private void ProductosCageteria(Venta venta)
        {   
            foreach(var detalle in venta.DetallesVentas)
            {
                if(detalle.Producto.ProductoCategoriaId == 1)
                {
                    _ventacafeteria.DetallesVentas.Add(detalle);
                }
                if(detalle.Producto.ProductoCategoriaId == 2)
                {
                    _ventaHelados.DetallesVentas.Add(detalle);
                }
            }

        }


    }
}
