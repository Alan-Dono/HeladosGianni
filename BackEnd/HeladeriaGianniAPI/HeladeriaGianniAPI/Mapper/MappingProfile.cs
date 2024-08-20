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
        }
    }
    
}
