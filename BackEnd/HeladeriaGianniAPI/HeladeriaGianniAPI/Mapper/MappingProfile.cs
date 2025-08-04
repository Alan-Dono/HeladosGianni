using System.Linq;
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

            CreateMap<Venta, VentaProductosDtoRes>()
                .ForMember(dest => dest.DetalleVenta, opt => opt.MapFrom(src => src.DetallesVentas));


            CreateMap<VentaDtoReq, Venta>().ReverseMap();

            // Mapeos para DetalleVenta
            CreateMap<DetalleVenta, DetalleVentaDtoRes>().ReverseMap();

            CreateMap<DetalleVentaDtoReq, DetalleVenta>().ReverseMap();


            // Mapeos para CierreCaja
            CreateMap<CierreCaja, CierreCajaDtoRes>()
                .ForMember(dest => dest.IdsVentas, opt => opt.MapFrom(MapIdsVentas)) // todas
                .ForMember(dest => dest.CantidadDeVentas, opt => opt.MapFrom(src => src.Ventas.Count)) // todas
                .ForMember(dest => dest.TotalDeVentas, opt => opt.MapFrom(src => src.Ventas.Sum(SumarVentasC))) // solo activas
                .ForMember(dest => dest.TotalDescuentos, opt => opt.MapFrom(src => src.Ventas.Sum(SumarDescuentosC)));


            CreateMap<IniciarCajaDtoReq, CierreCaja>();

            // Mapeos para Turno
            CreateMap<Turno, TurnoDtoRes>()
                .ForMember(dest => dest.IdsCierresCaja, opt => opt.MapFrom(MapIdsCierreCajasEnTurno))
                .ForMember(dest => dest.CantidadCierresParciales, opt => opt.MapFrom(src => src.CierreCajas.Count))
                .ForMember(dest => dest.TotalVentas, opt => opt.MapFrom(src => src.CierreCajas.Sum(SumarVentas)))
                .ForMember(dest => dest.TotalDescuentos, opt => opt.MapFrom(src => src.CierreCajas.Sum(SumarDescuentos)))
                .ForMember(dest => dest.CantidadDeVentas, opt => opt.MapFrom(src => src.CierreCajas.Sum(ContarVentas)));


            CreateMap<TurnoDtoReq, Turno>();



        }

        private List<int> MapIdsCierreCajasEnTurno(Turno turno , TurnoDtoRes dto)
        {
            var lista = new List<int>();
            foreach(var cierre in turno.CierreCajas)
            {
                lista.Add(cierre.Id);
            }
            return lista;
        }
        private List<int> MapIdsVentas(CierreCaja cierreCaja, CierreCajaDtoRes cierreCajaDtoRes)
        {
            var lista = new List<int>();
            if (cierreCaja?.Ventas != null)
            {
                foreach (var venta in cierreCaja.Ventas)
                {
                    lista.Add(venta.Id);
                }
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
/*
        private List<DetalleVenta> MapDetalleVentas(Venta venta, VentaProductosDtoRes productosDtoRes)
        {
            var lista = new List<DetalleVenta>();
            foreach(var detalle in venta.DetallesVentas)
            {
                lista.Add(detalle);
            }
            return lista;
        }*/

        
        private double SumarVentas(CierreCaja cierreCaja)
        {
            double Total = 0;
            foreach (var venta in cierreCaja.Ventas)
            {
                if ( venta.Activa == true)
                {
                    Total += venta.TotalVenta;
                }
                
            }
            return Total;
        }

        private double SumarDescuentos(CierreCaja cierreCaja)
        {
            double Total = 0;
            foreach(var venta in cierreCaja.Ventas)
            {
                if (venta.Activa == true)
                {
                    Total += venta.Descuentos;
                }
            }
            return Total;
        }



        private int ContarVentas(CierreCaja cierreCaja)
        {
            return cierreCaja.Ventas.Count();
        }

        private double SumarVentasC(Venta venta)
        {
            return venta.Activa ? venta.TotalVenta : 0;
        }

        private double SumarDescuentosC(Venta venta)
        {
            return venta.Activa ? venta.Descuentos : 0;
        }


    }
}
