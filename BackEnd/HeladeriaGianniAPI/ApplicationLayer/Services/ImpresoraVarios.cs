using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DomainLayer.Models;

namespace ApplicationLayer.Services
{
    public class ImpresoraVarios
    {
        private const string NOMBRE_IMPRESORA = "GianniPrinter";

        private Turno? _turno;
        private CierreCaja? _cierre;

        public ImpresoraVarios(Turno turno) => _turno = turno;
        public ImpresoraVarios(CierreCaja cierre) => _cierre = cierre;

        public void Imprimir()
        {
            PrintDocument pd = new();
            pd.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;

            // BUSCAR EL TAMAÑO DEFINIDO EN EL DRIVER
            foreach (PaperSize size in pd.PrinterSettings.PaperSizes)
            {
                if (size.PaperName.Contains("80 x 3276"))
                {
                    pd.DefaultPageSettings.PaperSize = size;
                    break;
                }
            }

            pd.DefaultPageSettings.Margins = new Margins(10, 10, 15, 30);

            if (!pd.PrinterSettings.IsValid)
                throw new Exception($"No se encontró la impresora '{NOMBRE_IMPRESORA}'");

            pd.PrintPage += Pd_PrintPage;
            pd.Print();
        }


        private void Pd_PrintPage(object sender, PrintPageEventArgs e)
        {
            using Font fuenteNormal = new("Arial", 10);
            using Font fuenteBold = new("Arial", 12, FontStyle.Bold);
            using Font fuenteBoldSubcategorias = new("Arial", 11, FontStyle.Bold);
            Graphics g = e.Graphics;

            float y = 10;
            float left = 10;

            // Título
            g.DrawString("RESUMEN", fuenteBold, Brushes.Black, left, y);
            y += 25;

            if (_turno != null)
            {
                g.DrawString($"Desde: {_turno.FechaInicio:dd/MM/yyyy HH:mm}", fuenteNormal, Brushes.Black, left, y);
                y += 20;
                g.DrawString($"Hasta: {_turno.FechaFin?.ToString("dd/MM/yyyy HH:mm") ?? "Actualmente activo"}", fuenteNormal, Brushes.Black, left, y);
                y += 25;

                // Empleados
                var empleados = _turno.CierreCajas
                    .Select(c => c.Empleado?.NombreEmpleado)
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Distinct()
                    .ToList();

                if (empleados.Any())
                {
                    g.DrawString("Empleados del turno:", fuenteBold, Brushes.Black, left, y);
                    y += 20;

                    foreach (var nombre in empleados)
                    {
                        g.DrawString($"- {nombre}", fuenteNormal, Brushes.Black, left + 10, y);
                        y += 20;
                    }

                    y += 5;
                }

                // Detalles
                var detalles = _turno.CierreCajas
                    .SelectMany(c => c.Ventas)
                    .Where(v => v.Activa)
                    .SelectMany(v => v.DetallesVentas)
                    .Where(d => d.Producto?.ProductoCategoria != null)
                    .ToList();

                AgruparYImprimir(detalles, g, fuenteNormal, fuenteBold, ref y, left, fuenteBoldSubcategorias);
            }
            else if (_cierre != null)
            {
                g.DrawString($"Cierre ID: {_cierre.Id}", fuenteNormal, Brushes.Black, left, y);
                y += 20;
                if (_cierre.Empleado != null)
                {
                    g.DrawString($"Empleado: {_cierre.Empleado.NombreEmpleado}", fuenteNormal, Brushes.Black, left, y);
                    y += 20;
                }
                g.DrawString($"Desde: {_cierre.FechaInicio:dd/MM/yyyy HH:mm}", fuenteNormal, Brushes.Black, left, y);
                y += 20;
                g.DrawString($"Hasta: {_cierre.FechaFin?.ToString("dd/MM/yyyy HH:mm") ?? "Actualmente activo"}", fuenteNormal, Brushes.Black, left, y);
                y += 25;


                // Detalles
                var detalles = _cierre.Ventas
                     .Where(v => v.Activa)
                     .SelectMany(v => v.DetallesVentas)
                     .Where(d => d.Producto?.ProductoCategoria != null)
                     .ToList();

                AgruparYImprimir(detalles, g, fuenteNormal, fuenteBold, ref y, left, fuenteBoldSubcategorias);
            }

            // Pie
            //y += 20;
            //g.DrawString($"Impreso: {DateTime.Now:dd/MM/yyyy HH:mm}", fuenteNormal, Brushes.Black, left, y);
            y += 20;
            g.DrawString("¡Gianni es familia!", fuenteNormal, Brushes.Black, left+80, y);

            e.HasMorePages = false;
        }


        private void AgruparYImprimir(List<DetalleVenta> detalles,Graphics g,Font fuenteNormal,Font fuenteBold, ref float y, float left,   Font fuenteBoldSubcategorias)
        {
            var productos = detalles
                .GroupBy(d => new
                {
                    Categoria = d.Producto.ProductoCategoria.NombreCategoria,
                    d.Producto.NombreProducto,
                    d.PrecioUnitario
                })
                .Select(g => new
                {
                    g.Key.Categoria,
                    g.Key.NombreProducto,
                    g.Key.PrecioUnitario,
                    Cantidad = g.Sum(x => x.Cantidad),
                    Total = g.Sum(x => x.Cantidad * x.PrecioUnitario)
                })
                .OrderBy(p => p.Categoria)
                .ToList();

            string categoriaActual = null;
            double subtotalCategoria = 0;
            double totalGeneral = 0;

            foreach (var item in productos)
            {
                if (item.Categoria != categoriaActual)
                {
                    // Si cambia la categoría y ya había una activa, imprimimos su subtotal
                    if (categoriaActual != null)
                    {
                        g.DrawString($"Subtotal {categoriaActual}: {subtotalCategoria.ToString("C0")}", fuenteBoldSubcategorias, Brushes.Black, left + 10, y);
                        y += 20;
                        subtotalCategoria = 0;
                    }

                    // Nueva categoría
                    categoriaActual = item.Categoria;
                    y += 10;
                    g.DrawString(categoriaActual.ToUpper(), fuenteBold, Brushes.Black, left, y);
                    y += 20;
                }

                // Producto
                string linea = $"{item.Cantidad} x {item.NombreProducto} - {item.Total.ToString("C0")}";
                g.DrawString(linea, fuenteNormal, Brushes.Black, left + 10, y);
                y += 20;

                subtotalCategoria += item.Total;
                totalGeneral += item.Total;
            }

            // Último subtotal
            if (categoriaActual != null)
            {
                g.DrawString($"Subtotal {categoriaActual}: {subtotalCategoria.ToString("C0")}", fuenteBoldSubcategorias, Brushes.Black, left + 10, y);
                y += 25;
            }

            // Línea separadora y total general
            g.DrawLine(Pens.Black, left, y, 270, y);
            y += 10;

            g.DrawString($"TOTAL GENERAL: {totalGeneral.ToString("C0")}", fuenteBold, Brushes.Black, left, y);
            y += 20;
        }
    }

}
