using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Interface
{
    public interface IConfiguracionTemaRepository
    {
        Task<ConfiguracionTema> GetByIdAsync(int id);
        Task<ConfiguracionTema> GetByUsuarioIdAsync(int usuarioId);
        Task<ConfiguracionTema> GetDefaultAsync();
        Task<ConfiguracionTema> CreateAsync(ConfiguracionTema configuracion);
        Task<ConfiguracionTema> UpdateAsync(ConfiguracionTema configuracion);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsForUsuarioAsync(int usuarioId);
    }
}
