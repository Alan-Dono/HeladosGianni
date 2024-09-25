using AutoMapper;
using DomainLayer.Models;
using HeladeriaGianniAPI.DTOs.Request;
using HeladeriaGianniAPI.DTOs.Response;
using Microsoft.IdentityModel.Tokens;


namespace HeladeriaGianniAPI.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Sabor, SaborDtoRes>().ReverseMap(); //Origen/Destino
            CreateMap<SaborDtoReq, Sabor>().ReverseMap();

            CreateMap<Empleado, EmpleadoDtoRes>().ReverseMap();
            CreateMap<EmpleadoDtoReq, Empleado>().ReverseMap();

            CreateMap<Turno, TurnoDtoRes>()
                .ForMember(dest => dest.Empleado, opt => opt.MapFrom(src => src.Empleado)) // Mapea Empleado si es necesario
                .ReverseMap();
            CreateMap<TurnoDtoReq, Turno>()
                .ForMember(dest => dest.FechaInicio, opt => opt.MapFrom(src => src.FechaInicio))
                .ForMember(dest => dest.FechaFin, opt => opt.Ignore()) // Ignora FechaFin en la solicitud
                .ReverseMap();

            CreateMap<ProductoCategoria, ProductoCategoriaDtoRes>().ReverseMap();
            CreateMap<ProductoCategoriaDtoReq, ProductoCategoria>();

            CreateMap<Proveedor, ProveedorDtoRes>().ReverseMap();
            CreateMap<ProveedorDtoReq, Proveedor>();

            // Mapeo para crear un producto
            CreateMap<ProductoCreacionDtoReq, Producto>()
                .ForMember(dest => dest.ProductoCategoriaId, opt => opt.MapFrom(src => src.ProductoCategoriaId))
                .ForMember(dest => dest.ProveedorId, opt => opt.MapFrom(src => src.ProveedorId))
                .ForMember(dest => dest.ProductoCategoria, opt => opt.Ignore())
                .ForMember(dest => dest.Proveedor, opt => opt.Ignore())
                .ReverseMap();
            // Mapeo para actualizar un producto
            CreateMap<ProductoActualizarDtoReq, Producto>()
                .ForMember(dest => dest.ProductoCategoriaId, opt => opt.MapFrom(src => src.ProductoCategoriaId))
                .ForMember(dest => dest.ProveedorId, opt => opt.MapFrom(src => src.ProveedorId))
                .ForMember(dest => dest.ProductoCategoria, opt => opt.Ignore())
                .ForMember(dest => dest.Proveedor, opt => opt.Ignore())
                .ReverseMap();

            // Mapeo para devolver un producto con sus detalles
            CreateMap<Producto, ProductoDtoRes>()
                .ForMember(dest => dest.ProductoCategoriaDtoRes, opt => opt.MapFrom(src => src.ProductoCategoria))
                .ForMember(dest => dest.ProveedorDtoRes, opt => opt.MapFrom(src => src.Proveedor))
                .ForMember(dest => dest.Foto, opt => opt.MapFrom(src => src.Foto)) // Incluir la propiedad Foto
                .ReverseMap();


            CreateMap<Producto, ProductoVentaDtoRes>()
                .ReverseMap();

            CreateMap<Venta, VentaDtoRes>()
                .ForMember(dest => dest.DetallesVentas, opt => opt.MapFrom(src => src.DetallesVentas));

            CreateMap<VentaDtoReq, Venta>()
                .ForMember(dest => dest.DetallesVentas, opt => opt.MapFrom(src => src.DetallesVentas));

            CreateMap<DetalleVenta, DetalleVentaDtoRes>()
                .ReverseMap();

            CreateMap<DetalleVentaDtoReq, DetalleVenta>()
                .ReverseMap();

        }


    }
}
