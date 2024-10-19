using DomainLayer.Models;


namespace DomainLayer.Interface
{
    public interface ITurnoRepository
    {
        Task<ICollection<Turno>> ObtenerTodosAsync();
        Task<Turno> ObtenerPorIdAsync(int id);
        Task<ICollection<Turno>> ObtenerPorFechasAsync(DateTime fechaDesde, DateTime fechaHasta);
        Task IniciarTurnoAsync(Turno turno);
        Task FinalizarTurno(int id);
        Task<Turno> ObtenerTurnoActivo();
        
        
    }
}

