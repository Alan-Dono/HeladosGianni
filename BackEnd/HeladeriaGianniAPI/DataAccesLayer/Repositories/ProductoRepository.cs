using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccesLayer.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly HeladeriaDbContext context;

        public ProductoRepository(HeladeriaDbContext context)
        {
            this.context = context;
        }

        public async Task AgregarFavorito(int id)
        {
            var existe = await context.Productos.FindAsync(id);
            if (existe != null)
            {
                existe.EsFavorito = true;
                await context.SaveChangesAsync();
            }
        }

        public async Task EliminarFavorito(int id)
        {
            var existe = await context.Productos.FindAsync(id);
            if (existe != null)
            {
                existe.EsFavorito = false;
                await context.SaveChangesAsync();
            }
        }

        public async Task AgregarProducto(Producto producto)
        {
            var existe = await context.Productos.AnyAsync(x => x.NombreProducto == producto.NombreProducto);
            if (existe)
            {
                throw new Exception($"El producto {producto.NombreProducto} ya existe");
            }
            await context.Productos.AddAsync(producto);
            await context.SaveChangesAsync();
        }

        public async Task EditarProducto(int id, Producto producto)
        {
            // Buscar el producto existente en la base de datos
            var productoExistente = await context.Productos
                //.AsNoTracking() // Asegúrate de no rastrear esta consulta si solo lo usas para obtener la entidad
                .FirstOrDefaultAsync(x => x.Id == id);

            if (productoExistente == null)
            {
                throw new Exception("Producto no encontrado");
            }

            // Asignar el ID del producto existente al producto recibido
            producto.Id = id;

            // Asignar los nuevos valores al producto existente sin crear un nuevo rastreo
            context.Entry(productoExistente).CurrentValues.SetValues(producto);

            // Guardar los cambios en la base de datos
            await context.SaveChangesAsync();
        }

        public async Task EliminarProducto(int id)
        {
            var existe = await context.Productos.FindAsync(id);
            if (existe == null)
            {
                throw new Exception($"El producto no existe");
            }
            context.Remove(existe);
            await context.SaveChangesAsync();
        }

        public async Task<Producto> ObtenerProductoPorId(int id)
        {
            var existe = await context.Productos.FindAsync(id);
            if(existe == null)
            {
                throw new Exception("El producto no existe");
            }
            var producto = await context.Productos
                .Include(x => x.ProductoCategoria)
                //.Include(x => x.Proveedor)
                .FirstOrDefaultAsync(p => p.Id == id);
            return producto;
        }

        public async Task<IEnumerable<Producto>> ObtenerProductos()
        {
            return await context.Productos
                .Include(x => x.ProductoCategoria)
                //.Include(x => x.Proveedor)
                .ToListAsync();
        }

        public async Task ActualizarOrdenProductos(Dictionary<int, int> ordenProductos)
        {
            foreach (var item in ordenProductos)
            {
                var producto = await context.Productos.FindAsync(item.Key);
                if (producto != null)
                {
                    producto.Orden = item.Value;
                }
            }
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Producto>> ObtenerProductosPorCategoria(int idCategoria)
        {
            return await context.Productos
                .Where(x => x.ProductoCategoriaId == idCategoria)
                .OrderBy(p => p.Orden)
                .ToListAsync();
        }

        public async Task<IEnumerable<Producto>> ObtenerFavoritos()
        {
            return await context.Productos
                .Include(x => x.ProductoCategoria)
                .Where(x => x.EsFavorito == true)
                .OrderBy(p => p.Orden)
                .ToListAsync();
        }

        
    }


}


