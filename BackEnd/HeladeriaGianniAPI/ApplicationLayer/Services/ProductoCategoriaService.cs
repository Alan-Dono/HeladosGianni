using DomainLayer.Interface;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer.Services
{
    public class ProductoCategoriaService
    {
        private readonly IProductoCategoriaRepository productoCategoriaRepository;

        public ProductoCategoriaService(IProductoCategoriaRepository productoCategoriaRepository)
        {
            this.productoCategoriaRepository = productoCategoriaRepository;
        }

        public async Task<IEnumerable<ProductoCategoria>> ObtenerCategorias()
        {
            return await productoCategoriaRepository.ObtenerCategorias();
        }

        public async Task<ProductoCategoria> ObtenerCategoriaPorId(int id)
        {
            return await productoCategoriaRepository.ObtenerPorId(id);
        }

        public async Task AgregarCategoria(ProductoCategoria productoCategoria)
        {
            await productoCategoriaRepository.AgregarCategoria(productoCategoria);
        }

        public async Task ActualizarCategoria(ProductoCategoria productoCategoria)
        {
            await productoCategoriaRepository.ActualizarCategoria(productoCategoria);
        }

        public async Task EliminarCategoria(int id)
        {
            await productoCategoriaRepository.EliminarCategoria(id);
        }
    }
}
