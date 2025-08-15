using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Drawing;
using System.Linq;
using DomainLayer.Models;

namespace ApplicationLayer.Services
{
    public class ImpresoraVarios
    {
        private const string NOMBRE_IMPRESORA = "GianniPrinter";

        private readonly Turno? _turno;
        private readonly CierreCaja? _cierre;
        private readonly double _totalDescuentos;

        public ImpresoraVarios(Turno turno)
        {
            _turno = turno;
            _totalDescuentos = turno.CierreCajas?
                .SelectMany(c => c.Ventas)
                .Where(v => v.Activa)
                .Sum(v => v.Descuentos) ?? 0;
        }

        public ImpresoraVarios(CierreCaja cierre)
        {
            _cierre = cierre;
            _totalDescuentos = cierre.Ventas?
                .Where(v => v.Activa)
                .Sum(v => v.Descuentos) ?? 0;
        }

        public void Imprimir()
        {
            PrintDocument pd = new();
            pd.PrinterSettings.PrinterName = NOMBRE_IMPRESORA;

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
            Graphics g = e.Graphics;

            float y = 10;
            float left = 10;

            // Título
            g.DrawString("RESUMEN", fuenteBold, Brushes.Black, left, y);
            y += 25;

            if (_turno != null)
            {
                ImprimirCabeceraTurno(g, fuenteNormal, ref y, left);
                var (detallesVentas, conceptosVarios) = ObtenerDatosTurno();
                ImprimirDetalles(detallesVentas, conceptosVarios, g, fuenteNormal, fuenteBold, ref y, left);
            }
            else if (_cierre != null)
            {
                ImprimirCabeceraCierre(g, fuenteNormal, ref y, left);
                var (detallesVentas, conceptosVarios) = ObtenerDatosCierre();
                ImprimirDetalles(detallesVentas, conceptosVarios, g, fuenteNormal, fuenteBold, ref y, left);
            }

            ImprimirPie(g, fuenteNormal, fuenteBold, ref y, left);
            e.HasMorePages = false;
        }

        private void ImprimirCabeceraTurno(Graphics g, Font fuenteNormal, ref float y, float left)
        {
            g.DrawString($"Desde: {_turno.FechaInicio:dd/MM/yyyy HH:mm}", fuenteNormal, Brushes.Black, left, y);
            y += 20;
            g.DrawString($"Hasta: {_turno.FechaFin?.ToString("dd/MM/yyyy HH:mm") ?? "Actualmente activo"}", fuenteNormal, Brushes.Black, left, y);
            y += 25;

            // Empleados
            var empleados = _turno.CierreCajas?
                .Select(c => c.Empleado?.NombreEmpleado)
                .Where(n => !string.IsNullOrWhiteSpace(n))
                .Distinct()
                .ToList() ?? new List<string>();

            if (empleados.Any())
            {
                g.DrawString("Empleados del turno:", fuenteNormal, Brushes.Black, left, y);
                y += 20;

                foreach (var nombre in empleados)
                {
                    g.DrawString($"- {nombre}", fuenteNormal, Brushes.Black, left + 10, y);
                    y += 20;
                }
                y += 5;
            }
        }

        private void ImprimirCabeceraCierre(Graphics g, Font fuenteNormal, ref float y, float left)
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
        }

        private (List<DetalleVenta>, List<ConceptoVariosAgrupado>) ObtenerDatosTurno()
        {
            var detallesVentas = _turno.CierreCajas?
                .SelectMany(c => c.Ventas)
                .Where(v => v.Activa)
                .SelectMany(v => v.DetallesVentas)
                .Where(d => d.Producto?.ProductoCategoria != null)
                .ToList() ?? new List<DetalleVenta>();

            var conceptosVarios = _turno.CierreCajas?
                .SelectMany(c => c.Ventas)
                .Where(v => v.Activa)
                .SelectMany(v => v.ConceptosVarios ?? new List<ConceptoVarios>())
                .GroupBy(c => c.Nombre) // Agrupar solo por nombre
                .Select(g => new ConceptoVariosAgrupado
                {
                    Nombre = g.Key,
                    PrecioUnitario = g.First().Precio, // Precio de referencia (primero encontrado)
                    Cantidad = g.Count(), // Suma de cantidades
                    Total = g.Sum(x => x.Precio) // Suma total de todos los precios
                })
                .ToList() ?? new List<ConceptoVariosAgrupado>();

            return (detallesVentas, conceptosVarios);
        }

        private (List<DetalleVenta>, List<ConceptoVariosAgrupado>) ObtenerDatosCierre()
        {
            var detallesVentas = _cierre.Ventas?
                .Where(v => v.Activa)
                .SelectMany(v => v.DetallesVentas)
                .Where(d => d.Producto?.ProductoCategoria != null)
                .ToList() ?? new List<DetalleVenta>();

            var conceptosVarios = _cierre.Ventas?
                .Where(v => v.Activa)
                .SelectMany(v => v.ConceptosVarios ?? new List<ConceptoVarios>())
                .GroupBy(c => c.Nombre) // Agrupar solo por nombre
                .Select(g => new ConceptoVariosAgrupado
                {
                    Nombre = g.Key,
                    PrecioUnitario = g.First().Precio, // Precio de referencia (primero encontrado)
                    Cantidad = g.Count(), // Suma de cantidades
                    Total = g.Sum(x => x.Precio) // Suma total de todos los precios
                })
                .ToList() ?? new List<ConceptoVariosAgrupado>();

            return (detallesVentas, conceptosVarios);
        }

        private void ImprimirDetalles(
    List<DetalleVenta> detallesVentas,
    List<ConceptoVariosAgrupado> conceptosVarios,
    Graphics g,
    Font fuenteNormal,
    Font fuenteBold,
    ref float y,
    float left)
        {
            // Agrupar productos por categoría y ordenar por categoría y luego por Orden del producto
            var productosPorCategoria = detallesVentas
                .GroupBy(d => d.Producto.ProductoCategoria.NombreCategoria)
                .OrderBy(g => g.Key) // Orden alfabético por nombre de categoría
                .Select(g => new
                {
                    Categoria = g.Key,
                    Productos = g.OrderBy(d => d.Producto.Orden) // Ordenar por campo Orden dentro de cada categoría
                                 .ThenBy(d => d.Producto.NombreProducto) // Orden alfabético como criterio secundario
                                 .GroupBy(d => new { d.Producto.NombreProducto, d.PrecioUnitario })
                                 .Select(p => new
                                 {
                                     p.Key.NombreProducto,
                                     p.Key.PrecioUnitario,
                                     Cantidad = p.Sum(x => x.Cantidad),
                                     Total = p.Sum(x => x.Cantidad * x.PrecioUnitario)
                                 })
                                 .ToList()
                })
                .ToList();

            double totalGeneral = 0;

            // Imprimir productos por categoría
            foreach (var grupo in productosPorCategoria)
            {
                g.DrawString(grupo.Categoria.ToUpper(), fuenteBold, Brushes.Black, left, y);
                y += 20;

                double subtotalCategoria = 0;

                foreach (var producto in grupo.Productos)
                {
                    string linea = $"{producto.Cantidad} x {producto.NombreProducto} - {producto.Total.ToString("C0")}";
                    g.DrawString(linea, fuenteNormal, Brushes.Black, left + 10, y);
                    y += 20;

                    subtotalCategoria += producto.Total;
                    totalGeneral += producto.Total;
                }

                g.DrawString($"Subtotal {grupo.Categoria}: {subtotalCategoria.ToString("C0")}", fuenteBold, Brushes.Black, left + 10, y);
                y += 25;
            }

            // Imprimir conceptos varios si existen
            if (conceptosVarios?.Any() == true)
            {
                g.DrawString("VARIOS", fuenteBold, Brushes.Black, left, y);
                y += 20;

                double subtotalVarios = 0;

                foreach (var item in conceptosVarios)
                {
                    string linea = $"{item.Cantidad} x {item.Nombre} - {item.Total.ToString("C0")}";
                    g.DrawString(linea, fuenteNormal, Brushes.Black, left + 10, y);
                    y += 20;

                    subtotalVarios += item.Total;
                    totalGeneral += item.Total;
                }

                g.DrawString($"Subtotal VARIOS: {subtotalVarios.ToString("C0")}", fuenteBold, Brushes.Black, left + 10, y);
                y += 25;
            }

            // Línea separadora
            g.DrawLine(Pens.Black, left, y, 270, y);
            y += 10;

            // Mostrar descuentos si existen
            if (_totalDescuentos > 0)
            {
                g.DrawString($"Descuentos: -{_totalDescuentos.ToString("C0")}", fuenteBold, Brushes.Black, left, y);
                y += 20;
            }

            // Total general
            g.DrawString($"TOTAL GENERAL: {(totalGeneral - _totalDescuentos).ToString("C0")}", fuenteBold, Brushes.Black, left, y);
            y += 20;
        }

        private void ImprimirPie(Graphics g, Font fuenteNormal, Font fuenteBold, ref float y, float left)
        {
            y += 20;
            g.DrawString("¡Gianni es familia!", fuenteNormal, Brushes.Black, left + 80, y);
        }
    }

    public class ConceptoVariosAgrupado
    {
        public string Nombre { get; set; }
        public double PrecioUnitario { get; set; }
        public int Cantidad { get; set; }
        public double Total { get; set; }
    }
}