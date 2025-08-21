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
        Task<Turno> ObtenerTurnoConResumen(int id);
        Task<(ICollection<Turno>, int)> ObtenerPaginadosAsync(int pageNumber, int pageSize);
        Task<(ICollection<Turno>, int)> ObtenerPorFechasPaginadoAsync(DateTime fechaDesde, DateTime fechaHasta, int pageNumber, int pageSize);
    }
}

