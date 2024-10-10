using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccesLayer
{
    public class HeladeriaDbContext : DbContext
    {

        public HeladeriaDbContext(DbContextOptions<HeladeriaDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de la relación entre CierreCaja y Turno
            modelBuilder.Entity<CierreCaja>()
                .HasOne(cc => cc.Turno) // CierreCaja tiene una relación con Turno
                .WithMany(t => t.CierreCajas) // Turno tiene muchas CierreCajas
                .HasForeignKey(cc => cc.IdTurno); // Clave foránea en CierreCaja

            // Configuración de la relación entre CierreCaja y Empleado
            modelBuilder.Entity<CierreCaja>()
                .HasOne(cc => cc.Empleado) // CierreCaja tiene una relación con Empleado
                .WithMany() // Empleado no tiene navegación hacia CierreCajas
                .HasForeignKey(cc => cc.IdEmpleado); // Clave foránea en CierreCaja

            // Configuración de la relación entre Venta y CierreCaja
            modelBuilder.Entity<Venta>()
                .HasOne(v => v.CierreCaja) // Venta tiene una relación con CierreCaja
                .WithMany(cc => cc.Ventas) // CierreCaja tiene muchas Ventas
                .HasForeignKey(v => v.IdCierreCaja); // Clave foránea en Venta

            // Configuración de la relación entre DetalleVenta y Venta
            modelBuilder.Entity<DetalleVenta>()
                .HasKey(dv => dv.Id); 

            modelBuilder.Entity<DetalleVenta>()
                .HasOne(dv => dv.Venta) // DetalleVenta tiene una relación con Venta
                .WithMany(v => v.DetallesVentas) // Venta tiene muchos DetalleVentas
                .HasForeignKey(dv => dv.VentaId); // Clave foránea en DetalleVenta

            // Configuración de la relación entre DetalleVenta y Producto
            modelBuilder.Entity<DetalleVenta>()
                .HasOne(dv => dv.Producto) // Cada DetalleVenta tiene un único Producto
                .WithMany() // Un Producto puede estar en muchos DetalleVentas
                .HasForeignKey(dv => dv.ProductoId); // Clave foránea en DetalleVenta

            // Configuración de la relación entre Producto y ProductoCategoria
            modelBuilder.Entity<Producto>()
                .HasOne(p => p.ProductoCategoria) // Producto tiene una relación con ProductoCategoria
                .WithMany() // No es necesario tener una navegación en ProductoCategoria
                .HasForeignKey(p => p.ProductoCategoriaId); // Clave foránea en Producto
        }



        public DbSet<ProductoCategoria> ProductoCategorias { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Turno> Turnos { get; set; }
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<Empleado> Empleado { get; set; }
        public DbSet<DetalleVenta> DetalleVenta { get; set; }
        //public DbSet<Proveedor> Proveedor { get; set; }
        public DbSet <CierreCaja> CierreCajas { get; set; }

    }
}
