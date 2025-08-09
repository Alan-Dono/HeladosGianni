using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccesLayer
{
    public class HeladeriaDbContext : DbContext
    {
        public HeladeriaDbContext(DbContextOptions<HeladeriaDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuracion de la relacion entre Turno y CierreCaja
            modelBuilder.Entity<Turno>()
                .HasMany(t => t.CierreCajas) // Un Turno tiene muchos CierreCajas
                .WithOne() // No hay navegación en CierreCaja hacia Turno
                .HasForeignKey(cc => cc.IdTurno); // La clave foránea en CierreCaja

            // Configuración de la relación entre CierreCaja y Empleado
            modelBuilder.Entity<CierreCaja>()
                .HasOne(cc => cc.Empleado) // CierreCaja tiene un Empleado
                .WithMany() // No hay propiedad de navegación en Empleado
                .HasForeignKey(cc => cc.IdEmpleado); // Clave foránea en CierreCaj

            // Configuración de la relación entre CierreCaja y Ventas
            modelBuilder.Entity<CierreCaja>()
                .HasMany(cc => cc.Ventas)
                .WithOne()
                .HasForeignKey(cc => cc.IdCierreCaja);

            // Configuración de la relación entre DetalleVenta y Venta
            modelBuilder.Entity<DetalleVenta>()
                .HasKey(dv => dv.Id);

            // Configuración de la relación entre DetalleVenta y Producto
            modelBuilder.Entity<DetalleVenta>()
                .HasOne(dv => dv.Producto)
                .WithMany()
                .HasForeignKey(dv => dv.ProductoId);

            // Configuración de la relación entre Producto y ProductoCategoria
            modelBuilder.Entity<Producto>()
                .HasOne(p => p.ProductoCategoria)
                .WithMany()
                .HasForeignKey(p => p.ProductoCategoriaId);

            modelBuilder.Entity<FacturaAfip>()
                 .HasOne(f => f.Venta)
                 .WithOne()
                 .HasForeignKey<FacturaAfip>(f => f.VentaId)
                 .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ConceptoVarios>(entity =>
            {
                entity.HasOne(c => c.Venta)
                      .WithMany(v => v.ConceptosVarios)
                      .HasForeignKey(c => c.IdVenta)
                      .OnDelete(DeleteBehavior.Cascade); // Esto activa el borrado en cascada
            });

           

        }
        
        public DbSet<ProductoCategoria> ProductoCategorias { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Turno> Turnos { get; set; }
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<Empleado> Empleados { get; set; } 
        public DbSet<DetalleVenta> DetallesVentas { get; set; } 
        public DbSet<CierreCaja> CierreCajas { get; set; }
        public DbSet<FacturaAfip> FacturasAfip { get; set; }

    }
}
