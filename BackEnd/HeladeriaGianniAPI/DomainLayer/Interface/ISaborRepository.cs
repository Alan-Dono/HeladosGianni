using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface ISaborRepository
    {
        Task<IEnumerable<Sabor>> ObtenerTodosAsync();
        Task<Sabor> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Sabor sabor);
    }
}
