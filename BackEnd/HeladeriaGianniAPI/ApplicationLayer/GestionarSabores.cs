using DomainLayer.Interface;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationLayer
{
    public class GestionarSabores
    {
        private readonly ISaborRepository _saborRepository;

        public GestionarSabores(ISaborRepository saborRepository)
        {
            _saborRepository = saborRepository;
        }

        public async Task<IEnumerable<Sabor>> ObtenerSaboresAsync()
        {
            return await _saborRepository.ObtenerTodosAsync();
        }

        public async Task<Sabor> ObtenerSaborPorIdAsync(int id)
        {
            return await _saborRepository.ObtenerPorIdAsync(id);
        }

        public async Task AgregarSaborAsync(Sabor sabor)
        {
            await _saborRepository.AgregarAsync(sabor);
        }
    }
}
