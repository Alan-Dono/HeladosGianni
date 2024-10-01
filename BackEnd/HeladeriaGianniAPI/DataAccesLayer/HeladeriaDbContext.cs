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

            modelBuilder.Entity<ProductoCategoria>()
                .HasIndex(pc => pc.NombreCategoria)
                .IsUnique();
        }


        public DbSet<Sabor> Sabores { get; set; }
        public DbSet<ProductoCategoria> ProductoCategorias { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Turno> Turnos { get; set; }
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<Empleado> Empleado { get; set; }
        public DbSet<DetalleVenta> DetalleVenta { get; set; }
        //public DbSet<Proveedor> Proveedor { get; set; }
        
    }
}
