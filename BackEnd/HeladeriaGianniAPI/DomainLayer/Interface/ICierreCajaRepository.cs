using DomainLayer.Models;


namespace DomainLayer.Interface
{
    public interface ICierreCajaRepository
    {
        Task<ICollection<CierreCaja>> ObtenerCierresPorTurno(int id);
        Task<ICollection<CierreCaja>> ObtenerCierresPorEmpleado(int id);
        Task<CierreCaja> ObtenerCierrePorId(int id);
        Task IniciarCaja(CierreCaja cierreCaja);
        Task CambiarResponsable(int idTurno,  CierreCaja cierreCajaNuevo);
        Task<CierreCaja> ObtenerCierreActivo();

    }
}
