using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace DataAccesLayer.Repositories
{
    public class ProductoCategoriaRepository : IProductoCategoriaRepository
    {
        private readonly HeladeriaDbContext context;

        public ProductoCategoriaRepository(HeladeriaDbContext context)
        {
            this.context = context;
        }

        public async Task ActualizarCategoria(ProductoCategoria productoCategoria)
        {
            // Verificar si el nombre de la categoría ya está en uso por otra categoría
            var existe = await context.ProductoCategorias
                .AnyAsync(x => x.NombreCategoria == productoCategoria.NombreCategoria && x.Id != productoCategoria.Id);

            if (existe)
            {
                throw new Exception("El nombre de la categoría ya existe.");
            }

            context.Update(productoCategoria);
            await context.SaveChangesAsync();       
        }

        public async Task AgregarCategoria(ProductoCategoria productoCategoria)
        {
            var existe = await context.ProductoCategorias.AnyAsync(x => x.NombreCategoria == productoCategoria.NombreCategoria);
            if (existe)
            {
                throw new Exception("La categoria ya existe");
            }
            await context.ProductoCategorias.AddAsync(productoCategoria);
            await context.SaveChangesAsync();
        }

        public async Task EliminarCategoria(int id)
        {
            var categoriaEliminar = await context.ProductoCategorias.FindAsync(id);
            if (categoriaEliminar == null)
            {
                throw new Exception("La categoria no existe");
            }
            context.Remove(categoriaEliminar);
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductoCategoria>> ObtenerCategorias()
        {
            return await context.ProductoCategorias.ToListAsync();
        }

        public async Task<ProductoCategoria> ObtenerPorId(int id)
        {
            var productoCategoria = await context.ProductoCategorias.FindAsync(id);
            if (productoCategoria == null) { throw new Exception("La categoria no existe"); }
            return productoCategoria; 
        }
    }
}
