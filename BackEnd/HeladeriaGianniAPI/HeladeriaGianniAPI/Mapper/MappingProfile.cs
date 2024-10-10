using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;

namespace HeladeriaGianniAPI.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
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

            // Mapeos para Venta
            CreateMap<Venta, VentaDtoRes>().ReverseMap();
            CreateMap<VentaDtoReq, Venta>().ReverseMap();

            // Mapeos para DetalleVenta
            CreateMap<DetalleVenta, DetalleVentaDtoRes>().ReverseMap();
            CreateMap<DetalleVentaDtoReq, DetalleVenta>()
                .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.Cantidad * src.PrecioUnitario)).ReverseMap();

            // Mapeos para CierreCaja
            CreateMap<CierreCaja, CierreCajaDtoRes>();


            CreateMap<CierreCajaDtoReq, CierreCaja>();

            // Mapeos para Turno
            CreateMap<Turno, TurnoDtoRes>().ReverseMap();
            CreateMap<TurnoDtoReq, Turno>().ReverseMap();

        }
    }
}
