using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;

namespace HeladeriaGianniAPI.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()    //origen / destino
        {
         
            // Mapeos para Empleado
            CreateMap<Empleado, EmpleadoDtoRes>()
                .ForMember(dest => dest.FechaContratacion,
                           opt => opt.MapFrom(src => src.FechaContratacion ?? DateTime.MinValue)); // Manejo de nulos

            CreateMap<EmpleadoDtoReq, Empleado>()
                .ForMember(dest => dest.FechaContratacion,
                           opt => opt.MapFrom(src => src.FechaContratacion));

            // Mapeos para ProductoCategoria
            CreateMap<ProductoCategoria, ProductoCategoriaDtoRes>().ReverseMap();
            CreateMap<ProductoCategoriaDtoReq, ProductoCategoria>();

            // Mapeos para Producto
            CreateMap<ProductoCreacionDtoReq, Producto>()
                .ForMember(dest => dest.ProductoCategoriaId, opt => opt.MapFrom(src => src.ProductoCategoriaId))
                .ForMember(dest => dest.ProductoCategoria, opt => opt.Ignore());

            CreateMap<ProductoActualizarDtoReq, Producto>()
                .ForMember(dest => dest.ProductoCategoriaId, opt => opt.MapFrom(src => src.ProductoCategoriaId))
                .ForMember(dest => dest.ProductoCategoria, opt => opt.Ignore());

            CreateMap<Producto, ProductoDtoRes>()
                .ForMember(dest => dest.ProductoCategoriaDtoRes, opt => opt.MapFrom(src => src.ProductoCategoria));

            CreateMap<Producto, ProductoVentaDtoRes>().ReverseMap();

            CreateMap<Venta, VentaDtoRes>()
                .ForMember(dest => dest.IdsDetalleVentas, opt => opt.MapFrom(MapIdsDetallesVentas));

            CreateMap<VentaDtoReq, Venta>().ReverseMap();

            // Mapeos para DetalleVenta
            CreateMap<DetalleVenta, DetalleVentaDtoRes>().ReverseMap();

            CreateMap<DetalleVentaDtoReq, DetalleVenta>().ReverseMap();
                //.ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.Cantidad * src.PrecioUnitario)).ReverseMap();

            // Mapeos para CierreCaja
            CreateMap<CierreCaja, CierreCajaDtoRes>();


            CreateMap<IniciarCajaDtoReq, CierreCaja>();

            // Mapeos para Turno
            CreateMap<Turno, TurnoDtoRes>()
                .ForMember(dest => dest.IdsCierresCaja, opt => opt.MapFrom(MapIdsCierreCajas));

            CreateMap<TurnoDtoReq, Turno>();

        }

        private List<int> MapIdsCierreCajas(Turno turno , TurnoDtoRes dto)
        {
            var lista = new List<int>();
            foreach(var cierre in turno.CierreCajas)
            {
                lista.Add(cierre.Id);
            }
            return lista;
        }

        private List<int> MapIdsDetallesVentas(Venta venta, VentaDtoRes ventaDto)
        {
            var lista = new List<int>();
            foreach (var detalle in venta.DetallesVentas)
            {
                lista.Add(detalle.Id);
            }
            return lista;
        }

    }
}
