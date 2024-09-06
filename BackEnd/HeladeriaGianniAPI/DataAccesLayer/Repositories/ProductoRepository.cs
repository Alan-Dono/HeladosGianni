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

        /*    public async Task EditarProducto(Producto producto, int id)
            {
                var productoExistente = await context.Productos.FindAsync(id);

                if (productoExistente == null)
                {
                    throw new Exception("Producto no encontrado");
                }
                productoExistente.NombreProducto = producto.NombreProducto;
                productoExistente.Precio = producto.Precio;
                productoExistente.Descripcion = producto.Descripcion;
                productoExistente.ProductoCategoriaId = producto.ProductoCategoriaId;
                productoExistente.ProveedorId = producto.ProveedorId;

                context.Update(productoExistente);
                await context.SaveChangesAsync();
            }*/
        public async Task EditarProducto(Producto producto, int id)
        {
            // Buscar el producto existente en la base de datos
            var productoExistente = await context.Productos
                .AsNoTracking() // Asegúrate de no rastrear esta consulta si solo lo usas para obtener la entidad
                .FirstOrDefaultAsync(x => x.Id == id);

            if (productoExistente == null)
            {
                throw new Exception("Producto no encontrado");
            }

            // Asignar el ID del producto existente al producto recibido
            producto.Id = id;

            // Actualizar el producto
            context.Update(producto);

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
                .Include(x => x.Proveedor)
                .FirstOrDefaultAsync(p => p.Id == id);
            return producto;
        }

        public async Task<IEnumerable<Producto>> ObtenerProductos()
        {
            return await context.Productos
                .Include(x => x.ProductoCategoria)
                .Include(x => x.Proveedor)
                .ToListAsync();
        }

        public async Task<IEnumerable<Producto>> ObtenerProductosPorCategoria(int idCategoria)
        {
            var productos = await context.Productos
                .Where(x => x.ProductoCategoriaId == idCategoria)
                .ToListAsync();
            return productos;
        }

        public async Task<IEnumerable<Producto>> ObtenerProductosPorProveedor(int idProveedor)
        {
            var productos = await context.Productos
                .Where(x => x.ProveedorId == idProveedor)
                .ToListAsync();
            return productos;
        }
    }
}
