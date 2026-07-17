using Microsoft.EntityFrameworkCore;
using DomainLayer.Interface;
using DomainLayer.Models;

namespace DataAccesLayer.Repositories
{
    public class ConfiguracionTemaRepository : IConfiguracionTemaRepository
    {
        private readonly HeladeriaDbContext _context;

        public ConfiguracionTemaRepository(HeladeriaDbContext context)
        {
            _context = context;
        }

        public async Task<ConfiguracionTema> GetByIdAsync(int id)
        {
            return await _context.ConfiguracionesTema
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ConfiguracionTema> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.ConfiguracionesTema
                .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId);
        }

        public async Task<ConfiguracionTema> GetDefaultAsync()
        {
            try
            {
                // Busca la configuración donde UsuarioId es null
                return await _context.ConfiguracionesTema
                    .FirstOrDefaultAsync(c => c.UsuarioId == null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GetDefaultAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<ConfiguracionTema> CreateAsync(ConfiguracionTema configuracion)
        {
            configuracion.CreatedAt = DateTime.UtcNow;
            configuracion.UpdatedAt = DateTime.UtcNow;

            _context.ConfiguracionesTema.Add(configuracion);
            await _context.SaveChangesAsync();
            return configuracion;
        }

        public async Task<ConfiguracionTema> UpdateAsync(ConfiguracionTema configuracion)
        {
            configuracion.UpdatedAt = DateTime.UtcNow;
            _context.ConfiguracionesTema.Update(configuracion);
            await _context.SaveChangesAsync();
            return configuracion;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var configuracion = await GetByIdAsync(id);
            if (configuracion == null) return false;

            _context.ConfiguracionesTema.Remove(configuracion);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsForUsuarioAsync(int usuarioId)
        {
            return await _context.ConfiguracionesTema
                .AnyAsync(c => c.UsuarioId == usuarioId);
        }
    }
}