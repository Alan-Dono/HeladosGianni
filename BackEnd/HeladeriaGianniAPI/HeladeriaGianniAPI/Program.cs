using ApplicationLayer;
using ApplicationLayer.Services;
using DataAccesLayer;
using DataAccesLayer.Repositories;
using DomainLayer.Interface;
using HeladeriaGianniAPI.Mapper;
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configuración de la base de datos
// Configuración del DbContext
builder.Services.AddDbContext<HeladeriaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("DataAccesLayer"))); // Especifica el ensamblado para las migraciones

// Inyección de dependencias
builder.Services.AddScoped<ISaborRepository, SaborRepository>();
builder.Services.AddScoped<GestionarSabores>();

builder.Services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();
builder.Services.AddScoped<EmpleadoService>();

builder.Services.AddScoped<ITurnoRepository, TurnoRepository>();
builder.Services.AddScoped<TurnoService>();
// Configuración de AutoMapper
//builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
