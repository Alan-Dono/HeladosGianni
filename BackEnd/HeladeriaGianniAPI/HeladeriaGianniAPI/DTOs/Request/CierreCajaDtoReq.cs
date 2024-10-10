namespace HeladeriaGianniAPI.DTOs.Request
{
    public class CierreCajaDtoReq
    {
        public int IdEmpleado { get; set; }
        public int IdTurno { get; set; }
        public DateTime Fecha { get; set; }
    }
}
