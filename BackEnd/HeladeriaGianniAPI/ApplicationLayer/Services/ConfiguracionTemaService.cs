using DomainLayer.Interface;
using DomainLayer.Models;

namespace ApplicationLayer.Services
{
    public class ConfiguracionTemaService
    {
        private readonly IConfiguracionTemaRepository _repository;

        public ConfiguracionTemaService(IConfiguracionTemaRepository repository)
        {
            _repository = repository;
        }

        public async Task<ConfiguracionTema> GetConfiguracionTemaAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<ConfiguracionTema> GetConfiguracionTemaByUsuarioAsync(int usuarioId)
        {
            return await _repository.GetByUsuarioIdAsync(usuarioId);
        }

        public async Task<ConfiguracionTema> GetDefaultConfiguracionTemaAsync()
        {
            try
            {
                // Busca una configuración sin usuarioId (configuración por defecto)
                return await _repository.GetDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GetDefaultConfiguracionTemaAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<ConfiguracionTema> CreateConfiguracionTemaAsync(ConfiguracionTema configuracion)
        {
            return await _repository.CreateAsync(configuracion);
        }

        public async Task<ConfiguracionTema> UpdateConfiguracionTemaAsync(int id, ConfiguracionTema configuracion)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Colors = configuracion.Colors;
            existing.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteConfiguracionTemaAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}